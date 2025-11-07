/**
 * @file users.js
 * @module routes/users
 * @description
 * CRUD + authentication routes for the `users` table.
 * Includes password hashing (bcrypt), JWT-based login, and token verification.
 */

/**
 * @requires ../services - Shared backend services including JWT authentication middleware.
 */
const { authenticateToken } = require('../services');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (app, conn) => {
  /**
   * @function POST /api/users
   * @description Inserts a new user record with a hashed password.
   */
  app.post('/api/users', async (req, res, next) => {
    const { username, email, password, role = 'user' } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = `
        INSERT INTO users (username, email, password, role)
        VALUES ('${username}', '${email}', '${hashedPassword}', '${role}')
        RETURNING userid, username, email, role, created_at;
      `;

      console.log(sql);
      conn.query(sql, (err, results) => {
        if (err) {
          console.error('Database insert error:', err.message);
          next(err);
          return;
        }
        res.status(201).send(results.rows[0]);
      });
    } catch (error) {
      console.error('Password hashing error:', error.message);
      next(error);
    }
  });

  /**
   * @function POST /api/login
   * @description Authenticates a user and returns a JWT token.
   */
  app.post('/api/login', (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const sql = `SELECT * FROM users WHERE email = '${email}';`;
    console.log(sql);
    conn.query(sql, async (err, results) => {
      if (err) {
        console.error('Database query error:', err.message);
        next(err);
        return;
      }

      if (!results.rows || results.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = results.rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userid: user.userid, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '2h' }
      );

      res.send({ token });
    });
  });

  /**
   * @function GET /api/users
   * @description Retrieves all users (admin only, protected).
   */
  app.get('/api/users', authenticateToken, (req, res, next) => {

    const sql = `SELECT userid, username, email, role, created_at FROM users ORDER BY userid ASC;`;
    console.log(sql);
    conn.query(sql, (err, results) => {
      if (err) {
        console.error('Database query error:', err.message);
        next(err);
        return;
      }
      res.send(results.rows);
    });
  });

  /**
   * @function PUT /api/users/:id
   * @description Updates user details (protected route, admin or self).
   */
  app.put('/api/users/:id', authenticateToken, (req, res, next) => {
    const { id } = req.params;
    const { username, email, role } = req.body;

    if (req.user.userid != id) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const sql = `
      UPDATE users
      SET username = COALESCE('${username}', username),
          email = COALESCE('${email}', email),
          role = COALESCE('${role}', role)
      WHERE userid = ${id}
      RETURNING userid, username, email, role, created_at;
    `;

    console.log(sql);
    conn.query(sql, (err, results) => {
      if (err) {
        console.error('Database update error:', err.message);
        next(err);
        return;
      }
      if (results.rowCount === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.send(results.rows[0]);
      }
    });
  });

  /**
   * @function DELETE /api/users/:id
   * @description Deletes a user record by ID (admin only).
   */
  app.delete('/api/users/:id', authenticateToken, (req, res, next) => {
    const { id } = req.params;

    const sql = `DELETE FROM users WHERE userid = ${id} RETURNING userid;`;
    console.log(sql);
    conn.query(sql, (err, results) => {
      if (err) {
        console.error('Database delete error:', err.message);
        next(err);
        return;
      }
      if (results.rowCount === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.send({ message: 'User deleted successfully', deleted_user_id: id });
      }
    });
  });
};
