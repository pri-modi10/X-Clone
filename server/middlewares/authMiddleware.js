// middlewares/authMiddleware.js

module.exports = function authMiddleware(req, res, next) {
  if (req.session && req.session.user) {
    // Make user data available to downstream middleware/controllers
    req.user = req.session.user;
    return next();
  }

  return res.status(401).json({ message: 'Unauthorized. Please login.' });
};
