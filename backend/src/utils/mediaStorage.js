const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const pool = require('../config/database');
const cloudinary = require('../config/cloudinary');

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

// Folder inside Cloudinary that holds every image uploaded from the admin panel.
const CLOUDINARY_ROOT = 'portfolio';

// Images saved in the database are served from here (see app.js). It starts with
// /uploads/ on purpose: the website, admin panel and mobile app already turn any
// "/uploads/..." path into a full URL on the API server.
const DB_IMAGE_PREFIX = '/uploads/db/';

// The free Clever Cloud MySQL database holds only 10 MB in TOTAL (projects, blogs,
// messages…). Images are shrunk on upload and may use at most this much of it.
const DEFAULT_DB_IMAGE_BUDGET_MB = 6;
const dbImageBudget = () =>
  Math.max(1, Number(process.env.MEDIA_DB_MAX_MB) || DEFAULT_DB_IMAGE_BUDGET_MB) * 1024 * 1024;

// An image that nothing points at any more (replaced thumbnail, deleted blog…) is
// removed after this long. The delay protects an image that was just uploaded but
// whose project/blog row hasn't been saved yet.
const UNUSED_IMAGE_GRACE_MINUTES = 15;

const isCloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

/**
 * Where uploaded images go (IMAGE_STORAGE in the environment):
 * - "db" (default): the MySQL database — permanent, no extra account needed.
 * - "cloudinary": Cloudinary, if its keys are set (much more space).
 * - "local": this server's disk — only for a fully local setup, because Render
 *   wipes its disk on every restart.
 */
const storageMode = () => {
  const mode = String(process.env.IMAGE_STORAGE || 'db').trim().toLowerCase();
  if (mode === 'cloudinary') {
    if (isCloudinaryConfigured()) return 'cloudinary';
    console.error('IMAGE_STORAGE=cloudinary but the Cloudinary keys are missing — saving images in the database instead.');
  }
  if (mode === 'local') return 'local';
  return 'db';
};

/** An error whose message is safe and useful to show in the admin panel. */
class StorageError extends Error {
  constructor(message, status = 503) {
    super(message);
    this.name = 'StorageError';
    this.expose = true;
    this.status = status;
  }
}

const formatMb = (bytes) => `${(Number(bytes) / 1024 / 1024).toFixed(1)} MB`;

const getExtension = (file) => {
  const originalExt = path.extname(file.originalname || '');
  if (originalExt) return originalExt;

  const mimeExt = (file.mimetype || '').split('/')[1];
  return mimeExt ? `.${mimeExt}` : '';
};

/** "My Photo (1).PNG" -> "my-photo-1" */
const safeBaseName = (file) =>
  path
    .parse(file.originalname || '')
    .name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || file.fieldname || 'image';

// ---------------------------------------------------------------------------
// Database storage
// ---------------------------------------------------------------------------

let mediaTableReady = null;
const ensureMediaTable = () => {
  mediaTableReady ||= pool
    .query(
      `CREATE TABLE IF NOT EXISTS media (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        mime VARCHAR(60) NOT NULL,
        size INT UNSIGNED NOT NULL,
        data MEDIUMBLOB NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB`
    )
    .catch((error) => {
      mediaTableReady = null; // try again next time
      throw error;
    });
  return mediaTableReady;
};

// GIFs (may be animated) and SVGs (vector) are kept as they are.
const KEEP_AS_IS = new Set(['image/gif', 'image/svg+xml']);

/**
 * Shrinks an image so it fits the small database: at most 1600px on its longest
 * side (2400px for the résumé, so its text stays sharp) and WebP format.
 * A 1–2 MB photo or screenshot typically becomes 80–250 KB.
 */
const compressImage = async (file, folder = '') => {
  if (KEEP_AS_IS.has(file.mimetype)) {
    return { buffer: file.buffer, mime: file.mimetype, ext: getExtension(file).toLowerCase() || '.img' };
  }

  const isDocument = folder.endsWith('settings');
  const isAvatar = folder.endsWith('testimonials'); // client photos are shown small
  const maxSide = isDocument ? 2400 : isAvatar ? 400 : 1600;
  try {
    const buffer = await sharp(file.buffer, { failOn: 'none' })
      .rotate() // respect the phone camera's orientation
      .resize({ width: maxSide, height: maxSide, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: isDocument ? 88 : 80, effort: 5 })
      .toBuffer();
    return { buffer, mime: 'image/webp', ext: '.webp' };
  } catch (error) {
    console.error('Image compression failed:', error.message);
    throw new StorageError('This file could not be read as an image. Please upload a JPG, PNG or WebP.', 400);
  }
};

// Every place that can point at an uploaded image.
const IMAGE_REFERENCES = [
  ['projects', 'thumbnail_url'],
  ['projects', 'description'],
  ['project_images', 'image_url'],
  ['blogs', 'cover_url'],
  ['blogs', 'content'],
  ['site_settings', 'setting_value'],
  ['skills', 'icon_url'],
  ['users', 'avatar_url'],
  ['testimonials', 'avatar_url'],
  ['testimonials', 'quote'],
];

/**
 * Deletes database images that no project, blog, setting, skill or testimonial
 * uses any more, so replaced and deleted images don't fill the 10 MB database.
 * Only checks tables that exist; if any check fails, nothing is deleted.
 */
const pruneUnusedImages = async () => {
  await ensureMediaTable();
  const [existing] = await pool.query(
    'SELECT table_name AS t, column_name AS c FROM information_schema.columns WHERE table_schema = DATABASE()'
  );
  const present = new Set(existing.map((row) => `${row.t}.${row.c}`.toLowerCase()));
  const references = IMAGE_REFERENCES.filter(([table, column]) => present.has(`${table}.${column}`));
  if (!references.length) return 0; // can't tell what is used — delete nothing
  const notUsed = references.map(
    ([table, column]) =>
      `NOT EXISTS (SELECT 1 FROM \`${table}\` r WHERE r.\`${column}\` LIKE CONCAT('%${DB_IMAGE_PREFIX}', media.id, '-%'))`
  ).join(' AND ');
  const [result] = await pool.query(
    `DELETE FROM media WHERE created_at < (NOW() - INTERVAL ${UNUSED_IMAGE_GRACE_MINUTES} MINUTE) AND ${notUsed}`
  );
  if (result.affectedRows) console.log(`Removed ${result.affectedRows} unused image(s) from the database.`);
  return result.affectedRows;
};

const dbImagesUsage = async () => {
  await ensureMediaTable();
  const [[row]] = await pool.query('SELECT COALESCE(SUM(size), 0) AS used, COUNT(*) AS count FROM media');
  return { used: Number(row.used), count: Number(row.count), budget: dbImageBudget() };
};

/** Compresses the image, saves it in the `media` table and returns its path. */
const saveToDatabase = async (file, folder) => {
  await ensureMediaTable();
  await pruneUnusedImages().catch((error) => console.error('Unused image cleanup skipped:', error.message));

  const { buffer, mime, ext } = await compressImage(file, folder);
  const { used, budget } = await dbImagesUsage();
  if (used + buffer.length > budget) {
    throw new StorageError(
      `Image storage is full: images already use ${formatMb(used)} of the ${formatMb(budget)} allowed ` +
        '(the free database is only 10 MB in total). Delete projects or blogs you no longer need — their ' +
        'images are removed automatically — or replace an existing image instead of adding a new one.'
    );
  }

  const name = `${safeBaseName(file)}${ext}`;
  const [result] = await pool.query('INSERT INTO media (name, mime, size, data) VALUES (?, ?, ?, ?)', [
    name,
    mime,
    buffer.length,
    buffer,
  ]);
  console.log(`Saved image ${name} in the database (${Math.round(file.buffer.length / 1024)} KB -> ${Math.round(buffer.length / 1024)} KB).`);
  return `${DB_IMAGE_PREFIX}${result.insertId}-${name}`;
};

// Small in-memory cache so popular images don't hit the database on every view.
const imageCache = new Map();
let imageCacheBytes = 0;
const IMAGE_CACHE_MAX_BYTES = 24 * 1024 * 1024;

/** Returns { mime, data } for a database image, or null if it doesn't exist. */
const getDbImage = async (id) => {
  const cached = imageCache.get(id);
  if (cached) {
    imageCache.delete(id); // move to the end = most recently used
    imageCache.set(id, cached);
    return cached;
  }

  await ensureMediaTable();
  const [rows] = await pool.query('SELECT mime, data FROM media WHERE id = ?', [id]);
  if (!rows.length) return null;

  const image = { mime: rows[0].mime, data: rows[0].data };
  imageCache.set(id, image);
  imageCacheBytes += image.data.length;
  for (const [key, value] of imageCache) {
    if (imageCacheBytes <= IMAGE_CACHE_MAX_BYTES) break;
    imageCache.delete(key);
    imageCacheBytes -= value.data.length;
  }
  return image;
};

/** Lists database images (newest first) for the admin panel's media library. */
const listDbImages = async (baseUrl) => {
  await ensureMediaTable();
  const [rows] = await pool.query('SELECT id, name, size, created_at FROM media ORDER BY id DESC');
  return rows.map((row) => ({
    name: row.name,
    url: `${baseUrl}${DB_IMAGE_PREFIX}${row.id}-${encodeURIComponent(row.name)}`,
    size: row.size,
    updated_at: row.created_at,
  }));
};

// ---------------------------------------------------------------------------
// Cloudinary and local disk
// ---------------------------------------------------------------------------

const uploadToCloudinary = (file, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    stream.end(file.buffer);
  });

const saveLocally = async (file) => {
  await fs.mkdir(uploadsDir, { recursive: true });

  const filename = `${file.fieldname}-${Date.now()}-${crypto.randomInt(1_000_000_000)}${getExtension(file)}`;
  const filePath = path.join(uploadsDir, filename);
  await fs.writeFile(filePath, file.buffer);

  // Return relative path so the frontend can prepend the correct BASE_URL
  return `/uploads/${filename}`;
};

/** Lists images stored in Cloudinary under the portfolio folder (newest first). */
const listCloudinaryImages = async () => {
  const result = await cloudinary.api.resources({
    type: 'upload',
    resource_type: 'image',
    prefix: `${CLOUDINARY_ROOT}/`,
    max_results: 200,
  });
  return (result.resources || [])
    .map((r) => ({
      name: r.public_id.split('/').pop(),
      url: r.secure_url,
      size: r.bytes,
      updated_at: r.created_at,
    }))
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
};

/**
 * Stores an uploaded image permanently and returns its URL (or /uploads/... path).
 * Never saves to Render's disk unless IMAGE_STORAGE=local, because that disk is
 * wiped on every restart and the image would vanish hours later.
 */
const storeImage = async (file, req, folder) => {
  if (!file) return null;

  const mode = storageMode();
  if (mode === 'cloudinary') {
    try {
      return await uploadToCloudinary(file, folder);
    } catch (error) {
      console.error('Cloudinary upload failed:', error.message);
      throw new StorageError(`Image upload to Cloudinary failed: ${error.message}`);
    }
  }

  if (mode === 'local') return saveLocally(file);

  try {
    return await saveToDatabase(file, folder);
  } catch (error) {
    if (error instanceof StorageError) throw error;
    console.error('Saving image in the database failed:', error.message);
    throw new StorageError(`Saving the image failed: ${error.message}`);
  }
};

module.exports = {
  storeImage,
  StorageError,
  storageMode,
  isCloudinaryConfigured,
  listCloudinaryImages,
  listDbImages,
  getDbImage,
  saveToDatabase,
  compressImage,
  pruneUnusedImages,
  dbImagesUsage,
  ensureMediaTable,
  uploadsDir,
  CLOUDINARY_ROOT,
  DB_IMAGE_PREFIX,
};
