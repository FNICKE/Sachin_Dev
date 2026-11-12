const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const cloudinary = require('../config/cloudinary');

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

// Folder inside Cloudinary that holds every image uploaded from the admin panel.
const CLOUDINARY_ROOT = 'portfolio';

const isCloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

// Saving to the server's own disk is only safe when the database is local too.
// On Render the disk is wiped on every restart (the free plan restarts after
// ~15 minutes idle), and a local backend shares the live database — either way
// the database ends up pointing at a file nobody can load. So local saving is
// opt-in: set ALLOW_LOCAL_UPLOADS=true only for a fully local setup.
const isLocalStorageAllowed = () => process.env.ALLOW_LOCAL_UPLOADS === 'true';

/** An error whose message is safe and useful to show in the admin panel. */
class StorageError extends Error {
  constructor(message) {
    super(message);
    this.name = 'StorageError';
    this.expose = true;
    this.status = 503;
  }
}

const getExtension = (file) => {
  const originalExt = path.extname(file.originalname || '');
  if (originalExt) return originalExt;

  const mimeExt = (file.mimetype || '').split('/')[1];
  return mimeExt ? `.${mimeExt}` : '';
};

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

/**
 * Stores an uploaded image permanently and returns its URL.
 * Uses Cloudinary; refuses (with a clear message) rather than saving to a disk
 * that will be wiped — a visible error beats an image that vanishes hours later.
 */
const storeImage = async (file, req, folder) => {
  if (!file) return null;

  if (isCloudinaryConfigured()) {
    try {
      return await uploadToCloudinary(file, folder);
    } catch (error) {
      console.error('Cloudinary upload failed:', error.message);
      throw new StorageError(`Image upload to Cloudinary failed: ${error.message}`);
    }
  }

  if (isLocalStorageAllowed()) {
    return saveLocally(file);
  }

  console.error('Upload refused: Cloudinary is not configured (CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET).');
  throw new StorageError(
    'Image storage is not set up. Add your Cloudinary keys (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) to the server environment, then upload again.'
  );
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

module.exports = {
  storeImage,
  StorageError,
  isCloudinaryConfigured,
  isLocalStorageAllowed,
  listCloudinaryImages,
  uploadsDir,
  CLOUDINARY_ROOT,
};
