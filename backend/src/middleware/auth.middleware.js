const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { errorResponse } = require('../utils/response');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Verifying Token:', token.substring(0, 10) + '...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded ID:', decoded.id);

      const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [decoded.id]);
      
      if (rows.length === 0) {
        console.log('User not found for ID:', decoded.id);
        return errorResponse(res, 'Not authorized, user not found', 401);
      }

      req.user = rows[0];
      console.log('User Authenticated:', req.user.email, 'Role:', req.user.role);
      next();
    } catch (error) {
      console.error('JWT Verification Failed:', error.message);
      return errorResponse(res, 'Not authorized, token failed', 401);
    }
  }

  if (!token) {
    console.log('No Token provided in headers');
    return errorResponse(res, 'Not authorized, no token', 401);
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    console.log('Admin Access Denied. User:', req.user?.email, 'Role:', req.user?.role);
    return errorResponse(res, 'Not authorized as an admin', 401);
  }
};

module.exports = { protect, admin };
