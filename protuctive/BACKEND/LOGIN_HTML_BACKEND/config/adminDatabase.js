// A SEPARATE connection pool, used ONLY by the admin-only route
// (see controllers/authController.js -> adminListUsers). This connects
// as 'shopnest_admin' instead of 'shopnest_app' -- a MySQL user with a
// different, wider privilege set (see DATABASE/roles_and_privileges.sql).
//
// This is what "connects roles to the login system" in practice: which
// database user handles a request is decided by requireAdmin.js BEFORE
// the controller even runs -- a regular user's request never touches
// this pool at all, even if there were a bug in the controller code.
require('dotenv').config();
const mysql = require('mysql2/promise');

const adminDb = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.ADMIN_DB_USER || 'shopnest_admin',
  password: process.env.ADMIN_DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shopnest',
  waitForConnections: true,
  connectionLimit: 5,
});

module.exports = adminDb;
