const fs = require('fs/promises');
const path = require('path');
const { successResponse, errorResponse } = require('../utils/response');
const {
  storageMode,
  listCloudinaryImages,
  listDbImages,
  getDbImage,
  dbImagesUsage,
  uploadsDir,
} = require('../utils/mediaStorage');

const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp']);

const baseUrlOf = (req) => `${req.protocol}://${req.get('host')}`;

const listLocalImages = async (req) => {
  try {
    const files = await fs.readdir(uploadsDir, { withFileTypes: true });
    const images = await Promise.all(
      files
        .filter((file) => file.isFile() && imageExtensions.has(path.extname(file.name).toLowerCase()))
        .map(async (file) => {
          const stats = await fs.stat(path.join(uploadsDir, file.name));
          return {
            name: file.name,
            url: `${baseUrlOf(req)}/uploads/${encodeURIComponent(file.name)}`,
            size: stats.size,
            updated_at: stats.mtime,
          };
        })
    );
    return images.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

// "Uploads Folder" in the admin panel: the images wherever they are stored.
const getUploadedImages = async (req, res) => {
  try {
    const mode = storageMode();
    const images =
      mode === 'cloudinary'
        ? await listCloudinaryImages()
        : mode === 'local'
          ? await listLocalImages(req)
          : await listDbImages(baseUrlOf(req));
    return successResponse(res, images);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Failed to load uploaded images.');
  }
};

// How much of the database's image space is used (for the admin panel).
const getStorageUsage = async (req, res) => {
  try {
    const { used, count, budget } = await dbImagesUsage();
    return successResponse(res, { mode: storageMode(), images: count, usedBytes: used, limitBytes: budget });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Failed to read image storage usage.');
  }
};

// GET /uploads/db/:file — public; serves an image saved in the database.
// ":file" looks like "12-my-project.webp"; only the number matters.
const serveDbImage = async (req, res, next) => {
  const id = Number.parseInt(req.params.file, 10);
  if (!Number.isSafeInteger(id) || id <= 0) return res.status(404).end();

  try {
    const image = await getDbImage(id);
    if (!image) return res.status(404).end();

    res.set({
      'Content-Type': image.mime,
      // An image saved under an id never changes, so browsers may keep it for a year.
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      // Uploaded SVGs must not be able to run scripts on this domain.
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });
    return res.send(image.data);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getUploadedImages, getStorageUsage, serveDbImage };
