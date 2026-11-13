const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  // The free Clever Cloud database allows only 5 connections in total — shared by
  // the live server, a local server and any scripts. So: at most 3 at once, keep
  // only 1 open while idle, and close the others after a minute.
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 3,
  maxIdle: 1,
  idleTimeout: 60000,
  enableKeepAlive: true,
  queueLimit: 0
});

// Test the connection immediately
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ MySQL Database Connected Successfully');
    connection.release();
  }
});

module.exports = pool.promise();
