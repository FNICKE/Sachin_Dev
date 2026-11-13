const pool = require('../config/database');
const transporter = require('../config/mailer');
const { successResponse, errorResponse } = require('../utils/response');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Save message and send notification
const sendMessage = async (req, res) => {
  const name = String(req.body?.name ?? '').trim();
  const email = String(req.body?.email ?? '').trim();
  const subject = String(req.body?.subject ?? '').trim();
  const message = String(req.body?.message ?? '').trim();
  const ip_address = req.ip;

  // Keep junk out of the small (10 MB) database. Generous limits: a project
  // brief from the planner is ~1 KB.
  if (!name || name.length > 120) return errorResponse(res, 'Please add your name.', 400);
  if (!EMAIL_RE.test(email) || email.length > 160) return errorResponse(res, 'Please add a valid email address.', 400);
  if (subject.length > 200) return errorResponse(res, 'The subject is too long (200 characters max).', 400);
  if (message.length < 2 || message.length > 6000) {
    return errorResponse(res, 'The message should be between 2 and 6000 characters.', 400);
  }

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
      // The message is already saved — a mail problem must not tell the visitor it failed
      // (they would send it again).
      try {
        await transporter.sendMail(mailOptions);
      } catch (mailError) {
        console.error('Contact email notification failed:', mailError.message);
      }
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
