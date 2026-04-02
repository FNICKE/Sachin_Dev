const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = generateToken(user.id);

    return successResponse(res, {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url,
      token
    }, 'Logged in successfully');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server error');
  }
};

// Register user (Only for initial setup or restricted access)
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return errorResponse(res, 'User already exists', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const token = generateToken(result.insertId);

    return successResponse(res, {
      id: result.insertId,
      name,
      email,
      token
    }, 'User registered successfully', 201);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server error');
  }
};

// Direct Password Reset (No Master Key required - as requested)
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // 1. Encrypt New Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 2. Update in Database
    const [result] = await pool.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Email not found in system.', 404);
    }

    return successResponse(res, null, 'Password successfully updated.');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Reset failed.');
  }
};

const getMe = async (req, res) => {
  return successResponse(res, req.user);
};

module.exports = { login, register, getMe, resetPassword };
