// This middleware protects routes that should only be accessible to logged-in users.
// It runs BEFORE the actual route handler (like getProfile), and either lets the
// request continue, or stops it with an error if there's no valid token.

const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

const requireAuth = async (req, res, next) => {
  // The frontend must send the token in the Authorization header like this:
  // Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided. Please log in.'
    });
  }

  // authHeader looks like "Bearer eyJhbGciOi..." -- we only want the part after "Bearer "
  const token = authHeader.split(' ')[1];

  try {
    // jwt.verify checks the token's signature against our secret.
    // If the token was tampered with, or expired, or fake, this throws an error.
    const decoded = jwt.verify(token, JWT_SECRET);

    // Even a valid, unexpired token should be rejected if the user already
    // logged out with it -- that's what makes logout actually work instead
    // of just being cosmetic on the frontend.
    const [blacklisted] = await db.query(
      'SELECT id FROM token_blacklist WHERE token = ?',
      [token]
    );
    if (blacklisted.length > 0) {
      return res.status(401).json({
        success: false,
        message: 'You have been logged out. Please log in again.'
      });
    }

    // Attach the decoded info (id, email, role) to req.user so the next
    // function (the actual route handler) can use it, e.g. req.user.id
    req.user = decoded;
    req.token = token; // handy for the logout route, which needs the raw token

    next(); // move on to the actual route handler
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.'
    });
  }
};

module.exports = requireAuth;
