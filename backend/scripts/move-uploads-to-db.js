/**
 * One-time fix for images that disappear: moves every image the database points
 * at under /uploads/... into the database itself (compressed), and updates the
 * links. After this, the images no longer depend on the server's disk.
 *
 *   node scripts/move-uploads-to-db.js           # dry run — shows what would happen
 *   node scripts/move-uploads-to-db.js --apply   # saves the images and updates the links
 *
 * Images are read from this computer's backend/uploads folder. Anything that
 * isn't there any more is listed as "missing" — re-upload those in the admin panel.
 * A backup of the old links is written before anything changes.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs = require('fs');
const os = require('os');
const path = require('path');
const pool = require('../src/config/database');
const {
  uploadsDir,
  compressImage,
  saveToDatabase,
  dbImagesUsage,
  DB_IMAGE_PREFIX,
} = require('../src/utils/mediaStorage');

const APPLY = process.argv.includes('--apply');

const MIME_BY_EXT = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

/** Returns the file name if the URL points at an /uploads/ file on any host (or relative). */
function uploadFileName(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.trim().match(/(?:^|\/\/[^/]+)\/uploads\/([^?#]+)$/);
  if (!match || `/uploads/${match[1]}`.startsWith(DB_IMAGE_PREFIX)) return null; // already in the database
  return decodeURIComponent(match[1]);
}

async function collectReferences() {
  const refs = [];
  const add = (rows, make) => rows.forEach((row) => refs.push(make(row)));

  const [projects] = await pool.query('SELECT id, title, thumbnail_url FROM projects');
  add(projects, (p) => ({ label: `Project "${p.title}"`, table: 'projects', column: 'thumbnail_url', id: p.id, idCol: 'id', url: p.thumbnail_url, folder: 'portfolio/projects' }));

  const [gallery] = await pool.query('SELECT id, project_id, image_url FROM project_images');
  add(gallery, (g) => ({ label: `Gallery image #${g.id} (project ${g.project_id})`, table: 'project_images', column: 'image_url', id: g.id, idCol: 'id', url: g.image_url, folder: 'portfolio/projects' }));

  const [blogs] = await pool.query('SELECT id, title, cover_url FROM blogs');
  add(blogs, (b) => ({ label: `Blog "${b.title}"`, table: 'blogs', column: 'cover_url', id: b.id, idCol: 'id', url: b.cover_url, folder: 'portfolio/blogs' }));

  const [skills] = await pool.query('SELECT id, name, icon_url FROM skills');
  add(skills, (s) => ({ label: `Skill "${s.name}" icon`, table: 'skills', column: 'icon_url', id: s.id, idCol: 'id', url: s.icon_url, folder: 'portfolio/skills' }));

  const [settings] = await pool.query('SELECT setting_key, setting_value FROM site_settings');
  add(settings, (s) => ({ label: `Setting "${s.setting_key}"`, table: 'site_settings', column: 'setting_value', id: s.setting_key, idCol: 'setting_key', url: s.setting_value, folder: 'portfolio/settings' }));

  return refs.filter((r) => uploadFileName(r.url));
}

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

function readUpload(file) {
  const localPath = path.join(uploadsDir, file);
  if (!localPath.startsWith(uploadsDir) || !fs.existsSync(localPath)) return null;
  return {
    buffer: fs.readFileSync(localPath),
    originalname: path.basename(file),
    mimetype: MIME_BY_EXT[path.extname(file).toLowerCase()] || 'image/png',
    fieldname: 'image',
  };
}

async function main() {
  const refs = await collectReferences();
  console.log(`${APPLY ? 'APPLYING' : 'DRY RUN'} — ${refs.length} image link(s) point at files under /uploads/\n`);

  const missing = [];
  const saved = new Map(); // file name -> database path (each file is saved once)
  const estimated = new Map(); // file name -> compressed size (dry run)
  const backup = [];
  let moved = 0;

  for (const ref of refs) {
    const file = uploadFileName(ref.url);
    const upload = readUpload(file);

    if (!upload) {
      missing.push(ref);
      console.log(`  MISSING   ${ref.label}  (${file}) — re-upload this one in the admin panel`);
      continue;
    }

    if (!APPLY) {
      if (!estimated.has(file)) estimated.set(file, (await compressImage(upload, ref.folder)).buffer.length);
      console.log(`  WILL MOVE ${ref.label}  (${file}: ${kb(upload.buffer.length)} -> about ${kb(estimated.get(file))})`);
      continue;
    }

    let dbPath = saved.get(file);
    if (!dbPath) {
      dbPath = await saveToDatabase(upload, ref.folder);
      saved.set(file, dbPath);
    }

    backup.push({ table: ref.table, column: ref.column, idCol: ref.idCol, id: ref.id, old: ref.url, new: dbPath });
    await pool.query(`UPDATE \`${ref.table}\` SET \`${ref.column}\` = ? WHERE \`${ref.idCol}\` = ?`, [dbPath, ref.id]);
    moved += 1;
    console.log(`  MOVED     ${ref.label}  ${ref.url}  ->  ${dbPath}`);
  }

  const { used, budget } = await dbImagesUsage();
  if (APPLY) {
    const backupFile = path.join(os.tmpdir(), `image-links-backup-${Date.now()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    console.log(`\nMoved ${moved} link(s) (${saved.size} image(s)); ${missing.length} missing.`);
    console.log(`Old links saved to ${backupFile}`);
  } else {
    const extra = [...estimated.values()].reduce((a, b) => a + b, 0);
    console.log(`\nWould move ${refs.length - missing.length} link(s) (${estimated.size} image(s), about ${kb(extra)} in total); ${missing.length} missing.`);
    console.log(`Image space after moving: about ${kb(used + extra)} of ${kb(budget)}.`);
    console.log('Run again with --apply to do it.');
  }
  if (APPLY) console.log(`Image space used: ${kb(used)} of ${kb(budget)}.`);
}

main()
  .catch((error) => {
    console.error('Failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
