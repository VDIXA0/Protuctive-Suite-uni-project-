// This file's ONLY job is mapping URLs to controller functions.
// It doesn't contain any logic itself -- just traffic direction.
const express = require('express');
const { register, login, getProfile, logout, adminListUsers } = require('../controllers/authController');
const requireAuth = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');
const router = express.Router();

// When a POST request hits "/register", run the register() function
router.post('/register', register);

// When a POST request hits "/login", run the login() function
router.post('/login', login);

// GET "/profile" is PROTECTED -- requireAuth runs first and checks the token.
// Only if requireAuth calls next() does getProfile actually run.
router.get('/profile', requireAuth, getProfile);

// POST "/logout" is also PROTECTED -- you can only log out of a session
// you're actually logged into.
router.post('/logout', requireAuth, logout);

// GET "/admin/users" is PROTECTED TWICE -- first requireAuth checks you're
// logged in at all (authentication), then requireAdmin checks your role is
// 'admin' (authorization). A regular user gets a 403 from requireAdmin.
router.get('/admin/users', requireAuth, requireAdmin, adminListUsers);

// Export this router so server.js can plug it into the app
module.exports = router;