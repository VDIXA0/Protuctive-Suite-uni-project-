// Same pattern as LOGIN_HTML_BACKEND/middleware/authMiddleware.js.
// Protects routes that modify data (create/update/delete products) so only
// a logged-in user can change the product catalog -- anyone can still browse it.
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
// IMPORTANT: this must be the SAME secret value as in LOGIN_HTML_BACKEND's .env,
// since tokens are issued by the login backend but verified here.

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided. Please log in.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.'
    });
  }
};

module.exports = requireAuth;
