const pool = require('../config/database');
const transporter = require('../config/mailer');
const { successResponse, errorResponse } = require('../utils/response');

// Save message and send notification
const sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;
  const ip_address = req.ip;

  try {
    const [result] = await pool.query(
      'INSERT INTO contacts (name, email, subject, message, ip_address) VALUES (?, ?, ?, ?, ?)',
      [name, email, subject || 'No Subject', message, ip_address]
    );

    // Send email notification (Optional)
    if (process.env.EMAIL_USER) {
      const mailOptions = {
        from: process.env.EMAIL_FROM || email,
        to: process.env.EMAIL_USER,
        subject: `[Portfolio Contact] - ${subject || 'New Message'}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
      };
      await transporter.sendMail(mailOptions);
    }

    return successResponse(res, { id: result.insertId }, 'Message sent successfully', 201);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server error sending message');
  }
};

// Get all messages (Admin)
const getAllMessages = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    return successResponse(res, rows);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server error fetching messages');
  }
};

// Update message status
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE contacts SET status = ? WHERE id = ?', [status, id]);
    return successResponse(res, null, 'Status updated');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server error updating status');
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM contacts WHERE id = ?', [id]);
    return successResponse(res, null, 'Message deleted');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server error deleting message');
  }
};

module.exports = { sendMessage, getAllMessages, updateStatus, deleteMessage };
