/**
 * @file services.js
 * @module services
 * @description
 * Provides shared backend services such as JWT authentication middleware.
 */

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @function authenticateToken
 * @description
 * Express middleware that verifies JWT tokens from the Authorization header.
 * - Extracts the token from the "Authorization: Bearer <token>" header.
 * - Verifies it against the server's secret key.
 * - Attaches decoded user info (e.g., userid, username, role) to req.user.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {void} Calls `next()` if valid, otherwise sends a 401 or 403 error response.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Invalid token:', err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
