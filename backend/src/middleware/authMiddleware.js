const jwt = require('jsonwebtoken');
const config = require('../config/env');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || (roles.length && !roles.includes(req.user.role))) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  return next();
};

module.exports = {
  authenticate,
  authorize
};
