const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const cloudinary = require('../config/cloudinary');

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

const isCloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

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

const saveLocally = async (file, req) => {
  await fs.mkdir(uploadsDir, { recursive: true });

  const filename = `${file.fieldname}-${Date.now()}-${crypto.randomInt(1_000_000_000)}${getExtension(file)}`;
  const filePath = path.join(uploadsDir, filename);
  await fs.writeFile(filePath, file.buffer);

  // Return relative path so the frontend can prepend the correct BASE_URL
  return `/uploads/${filename}`;
};

const storeImage = async (file, req, folder) => {
  if (!file) return null;

  if (isCloudinaryConfigured()) {
    try {
      return await uploadToCloudinary(file, folder);
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Cloudinary upload failed: ${error.message}`);
      }
      console.warn('Cloudinary upload failed, using local dev storage:', error.message);
    }
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Persistent image storage is not configured. Add Cloudinary credentials before uploading images.');
  }

  return saveLocally(file, req);
};

module.exports = { storeImage };
