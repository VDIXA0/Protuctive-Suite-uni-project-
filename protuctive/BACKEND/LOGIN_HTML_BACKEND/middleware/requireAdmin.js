// This middleware demonstrates AUTHORIZATION (as opposed to authMiddleware.js,
// which only checks AUTHENTICATION -- "are you logged in at all?").
// It must run AFTER requireAuth, since it relies on req.user already
// being set from the verified token.
//
// Authentication = "who are you?"
// Authorization  = "are you allowed to do THIS specific thing?"

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ // 403 = "Forbidden" -- logged in, but not allowed
      success: false,
      message: 'Admin access only.'
    });
  }
  next();
};

module.exports = requireAdmin;
