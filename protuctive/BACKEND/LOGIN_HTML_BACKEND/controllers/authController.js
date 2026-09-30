// The "controller" is where the actual DECISION-MAKING happens.
// It reads the incoming request, talks to the model, and decides what response to send back.

const bcrypt = require('bcryptjs');   // library for hashing passwords securely
const jwt = require('jsonwebtoken');  // library for creating login tokens
const UserModel = require('../models/userModel'); // our database functions from step 4

// The secret key used to "sign" tokens, so we can tell if a token is genuine or fake later.
// Falls back to a default only so the app doesn't crash if you forget to set it -- always set your own in .env!
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// ===================== REGISTER =====================
const register = async (req, res) => {
  try {
    // req.body contains whatever JSON the frontend sent (name, email, password)
    const { name, email, password } = req.body;

    // Basic validation -- don't even try to save if something's missing
    if (!name || !email || !password) {
      return res.status(400).json({ // 400 = "Bad Request", client sent something wrong
        success: false,
        message: 'Name, email, and password are all required'
      });
    }

    // Check if someone already registered with this email
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ // 409 = "Conflict" -- resource already exists
        success: false,
        message: 'An account with that email already exists'
      });
    }

    // NEVER store the real password. bcrypt.hash() scrambles it into something
    // irreversible. The "10" is the "cost factor" -- higher = slower but more secure.
    // Even if someone steals your database, they can't read the real passwords.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user, but with the HASHED password, not the real one
    const newUser = await UserModel.create({ name, email, password: hashedPassword });

    // Create a JWT -- basically a signed, tamper-proof "ID card" for this user.
    // It contains their id/email/role, is valid for 7 days (this is the whole
    // "session" -- there's no separate session store, the token itself IS
    // the session, and it stops being valid the moment it expires or is
    // blacklisted by /logout).
    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
      expiresIn: '7d'
    });

    // 201 = "Created" -- the standard success code for creating something new
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
      // notice: we never send the password back, hashed or not
    });
  } catch (error) {
    // Catches anything unexpected (e.g. database down) so the server doesn't crash
    res.status(500).json({ // 500 = "Internal Server Error" -- our fault, not the user's
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// ===================== LOGIN =====================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Look the user up by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      // Deliberately vague message -- we don't say "email not found" specifically,
      // because that would let attackers figure out which emails are registered.
      return res.status(401).json({ // 401 = "Unauthorized"
        success: false,
        message: 'Invalid email or password'
      });
    }

    // bcrypt.compare() re-hashes the submitted password using the same method,
    // and checks if it matches the hash stored in the database.
    // We can never "un-hash" the stored password to check it directly -- only compare.
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password' // same vague message as above, on purpose
      });
    }

    // Password checks out -- issue a fresh login token, including their role
    // so requireAdmin.js can check it later without an extra DB lookup.
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(200).json({ // 200 = "OK", standard success
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// ===================== GET PROFILE =====================
// This route is protected by authMiddleware.js, so by the time this function runs,
// we already know the request has a valid token, and req.user.id is available.
const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      // This would only happen if the user was deleted after their token was issued
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch profile',
      error: error.message
    });
  }
};

// ===================== LOGOUT =====================
// Protected by requireAuth, so req.user and req.token are already set.
// A JWT can't be "cancelled" -- it's just signed data the client holds --
// so to make logout actually work server-side, we record the token here.
// authMiddleware.js checks this table on every request and rejects any
// token found in it, even if it hasn't expired yet.
const logout = async (req, res) => {
  try {
    // Decode the token again just to read its real expiry time, so we
    // don't keep rows around forever after the token would've expired anyway.
    const decoded = jwt.decode(req.token);
    const expiresAt = new Date(decoded.exp * 1000);

    await UserModel.blacklistToken(req.token, expiresAt);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
};

// ===================== ADMIN: LIST ALL USERS =====================
// Protected by requireAuth + requireAdmin (see authRoutes.js), so only a
// logged-in user whose token has role: 'admin' ever reaches this point.
// This is the concrete demo of "different users have different access":
// a normal user gets a 403 from requireAdmin before this function even runs.
const adminListUsers = async (req, res) => {
  try {
    const users = await UserModel.findAllAdmin();
    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch users',
      error: error.message
    });
  }
};

// Make all functions available to be imported elsewhere (in authRoutes.js)
module.exports = { register, login, getProfile, logout, adminListUsers };