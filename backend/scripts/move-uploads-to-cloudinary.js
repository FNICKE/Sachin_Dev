/**
 * One-time fix for images that disappear: moves every image the database
 * points at under /uploads/... into Cloudinary and updates the database.
 *
 *   node scripts/move-uploads-to-cloudinary.js           # dry run — shows what would happen
 *   node scripts/move-uploads-to-cloudinary.js --apply   # uploads and updates the database
 *
 * Images are read from this computer's backend/uploads folder. Anything that
 * isn't there any more is listed as "missing" — re-upload those in the admin panel.
 * Needs CLOUDINARY_* keys in backend/.env for --apply.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs = require('fs');
const path = require('path');
const pool = require('../src/config/database');
const cloudinary = require('../src/config/cloudinary');
const { isCloudinaryConfigured, uploadsDir, CLOUDINARY_ROOT } = require('../src/utils/mediaStorage');

const APPLY = process.argv.includes('--apply');

/** Returns the file name if the URL points at an /uploads/ file on any host (or relative). */
function uploadFileName(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/(?:^|\/\/[^/]+)\/uploads\/([^?#]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function columnExists(table, column) {
  try {
    const [rows] = await pool.query(`SHOW COLUMNS FROM \`${table}\` LIKE ?`, [column]);
    return rows.length > 0;
  } catch {
    return false; // table missing
  }
}

async function collectReferences() {
  const refs = [];
  const [projects] = await pool.query('SELECT id, title, thumbnail_url FROM projects');
  for (const p of projects) {
    refs.push({ label: `Project "${p.title}"`, table: 'projects', column: 'thumbnail_url', id: p.id, idCol: 'id', url: p.thumbnail_url, folder: 'projects' });
  }

  const [blogs] = await pool.query('SELECT id, title, cover_url FROM blogs');
  for (const b of blogs) {
    refs.push({ label: `Blog "${b.title}"`, table: 'blogs', column: 'cover_url', id: b.id, idCol: 'id', url: b.cover_url, folder: 'blogs' });
  }

  for (const column of ['url', 'image_url']) {
    if (await columnExists('project_images', column)) {
      const [images] = await pool.query(`SELECT id, project_id, \`${column}\` AS url FROM project_images`);
      for (const img of images) {
        refs.push({ label: `Gallery image #${img.id} (project ${img.project_id})`, table: 'project_images', column, id: img.id, idCol: 'id', url: img.url, folder: 'projects' });
      }
    }
  }

  const [settings] = await pool.query("SELECT setting_key, setting_value FROM site_settings WHERE setting_key = 'resume_url'");
  for (const s of settings) {
    refs.push({ label: 'Résumé', table: 'site_settings', column: 'setting_value', id: s.setting_key, idCol: 'setting_key', url: s.setting_value, folder: 'settings' });
  }

  return refs.filter((r) => uploadFileName(r.url));
}

async function main() {
  if (APPLY && !isCloudinaryConfigured()) {
    console.error('Cloudinary keys are missing in backend/.env (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).');
    process.exitCode = 1;
    return;
  }

  const refs = await collectReferences();
  console.log(`${APPLY ? 'APPLYING' : 'DRY RUN'} — ${refs.length} database image(s) point at /uploads/\n`);

  const uploaded = new Map(); // file name -> Cloudinary URL (upload each file once)
  const missing = [];
  let moved = 0;

  for (const ref of refs) {
    const file = uploadFileName(ref.url);
    const localPath = path.join(uploadsDir, file);

    if (!fs.existsSync(localPath)) {
      missing.push(ref);
      console.log(`  MISSING   ${ref.label}  (${file}) — re-upload this one in the admin panel`);
      continue;
    }

    if (!APPLY) {
      console.log(`  WILL MOVE ${ref.label}  (${file})`);
      continue;
    }

    let secureUrl = uploaded.get(file);
    if (!secureUrl) {
      const result = await cloudinary.uploader.upload(localPath, {
        folder: `${CLOUDINARY_ROOT}/${ref.folder}`,
        resource_type: 'image',
        use_filename: true,
        unique_filename: true,
      });
      secureUrl = result.secure_url;
      uploaded.set(file, secureUrl);
    }

    await pool.query(`UPDATE \`${ref.table}\` SET \`${ref.column}\` = ? WHERE \`${ref.idCol}\` = ?`, [secureUrl, ref.id]);
    moved += 1;
    console.log(`  MOVED     ${ref.label}  →  ${secureUrl}`);
  }

  console.log(
    `\n${APPLY ? `Moved ${moved}` : `Would move ${refs.length - missing.length}`} image(s); ${missing.length} missing.` +
      (APPLY ? '' : '\nRun again with --apply to do it.')
  );
}

main()
  .catch((error) => {
    console.error('Failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
