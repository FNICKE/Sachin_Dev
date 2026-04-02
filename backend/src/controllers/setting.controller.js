const pool = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

// Get Resume URL
const getResume = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT setting_value FROM site_settings WHERE setting_key = "resume_url"');
    const resumeUrl = rows.length > 0 ? rows[0].setting_value : '';
    return successResponse(res, { resume_url: resumeUrl });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Failed to fetch resume.');
  }
};

// Update/Upload Resume
const updateResume = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded.', 400);
    }

    const resumeUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    await pool.query(
      'INSERT INTO site_settings (setting_key, setting_value) VALUES ("resume_url", ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      [resumeUrl, resumeUrl]
    );

    return successResponse(res, { resume_url: resumeUrl }, 'Resume uploaded successfully.');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Resume upload failed.');
  }
};

module.exports = { getResume, updateResume };
