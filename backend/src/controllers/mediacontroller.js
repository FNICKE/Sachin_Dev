const fs = require('fs/promises');
const path = require('path');
const { successResponse, errorResponse } = require('../utils/response');
const { isCloudinaryConfigured, listCloudinaryImages, uploadsDir } = require('../utils/mediaStorage');

const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp']);

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
            url: `${req.protocol}://${req.get('host')}/uploads/${encodeURIComponent(file.name)}`,
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

// "Uploads Folder" in the admin panel: images in Cloudinary when it is set up,
// otherwise the files on this server's disk.
const getUploadedImages = async (req, res) => {
  try {
    const images = isCloudinaryConfigured() ? await listCloudinaryImages() : await listLocalImages(req);
    return successResponse(res, images);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Failed to load uploaded images.');
  }
};

module.exports = { getUploadedImages };
