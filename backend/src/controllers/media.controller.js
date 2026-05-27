const fs = require('fs/promises');
const path = require('path');
const { successResponse, errorResponse } = require('../utils/response');

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp']);

const getUploadedImages = async (req, res) => {
  try {
    const files = await fs.readdir(uploadsDir, { withFileTypes: true });
    const images = await Promise.all(
      files
        .filter((file) => file.isFile() && imageExtensions.has(path.extname(file.name).toLowerCase()))
        .map(async (file) => {
          const filePath = path.join(uploadsDir, file.name);
          const stats = await fs.stat(filePath);

          return {
            name: file.name,
            url: `${req.protocol}://${req.get('host')}/uploads/${file.name}`,
            size: stats.size,
            updated_at: stats.mtime,
          };
        })
    );

    images.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return successResponse(res, images);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return successResponse(res, []);
    }

    console.error(error);
    return errorResponse(res, 'Failed to load uploaded images.');
  }
};

module.exports = { getUploadedImages };
