// The "model" is the ONLY layer allowed to talk directly to the users table.
const db = require('../config/database');
const adminDb = require('../config/adminDatabase');

const userModel = {

  // Looks up a single user by their email address.
  // Renamed from getUserByEmail -> findByEmail so it matches what authController.js calls.
  findByEmail: async (email) => {
    // The "?" is a placeholder -- MySQL safely inserts the email value in its place.
    // NEVER build SQL strings by gluing text together (SQL injection risk).
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  // Looks up a single user by their id (needed for the "get profile" endpoint,
  // since the JWT only stores the user's id, not their full info).
  findById: async (id) => {
    const [rows] = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  },

  // Inserts a brand new user row into the table.
  // NOTE: by the time this runs, the password has ALREADY been hashed by the controller.
  // Every new account starts as role='user' (the table default) -- nobody can
  // register themselves as admin, that has to be granted separately (see schema.sql).
  create: async ({ name, email, password }) => {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    // result.insertId is the auto-generated ID MySQL just assigned to this new row
    return { id: result.insertId, name, email, role: 'user' };
  },

  // ADMIN-ONLY query: lists every user. Deliberately uses the adminDb pool
  // (connects as 'shopnest_admin', not 'shopnest_app') -- this is the concrete
  // proof that a regular user's DB connection is physically incapable of
  // running this query, not just blocked by an "if" statement in JS.
  findAllAdmin: async () => {
    const [rows] = await adminDb.query('SELECT id, name, email, role, created_at FROM users');
    return rows;
  },

  // Records a token as "logged out" so authMiddleware.js rejects it on
  // future requests, even though the token itself is still validly signed.
  blacklistToken: async (token, expiresAt) => {
    await db.query(
      'INSERT INTO token_blacklist (token, expires_at) VALUES (?, ?)',
      [token, expiresAt]
    );
  }
};

module.exports = userModel;
