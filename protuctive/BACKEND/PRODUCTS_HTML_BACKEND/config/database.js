// This file's only job: open a connection to MySQL and hand it to the rest of the app.
require('dotenv').config();
const mysql = require('mysql2/promise');

// A "pool" is a batch of ready-to-use connections to the database.
// Instead of opening/closing a connection for every single query (slow),
// we open a pool once and reuse connections from it (fast).
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shopnest',
  waitForConnections: true,
  connectionLimit: 10,
});

// This block just runs ONCE when the server starts, to confirm MySQL is reachable.
db.getConnection()
  .then((connection) => {
    console.log('Database connected');
    connection.release();
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

module.exports = db;
