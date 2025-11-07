/**
 * @file rawData.js
 * @module routes/rawData
 * @description
 * Provides basic data-fetching endpoints that query entire tables
 * directly from the PostgreSQL database. These routes are primarily
 * used for raw data inspection and lightweight data retrieval
 * without additional logic or aggregation.
 */

/**
 * @requires ../services - Shared backend services including JWT authentication middleware.
 */
const { authenticateToken } = require('../services');


/**
 * @function module.exports
 * @description
 * Registers the raw-data route handlers with the provided Express app.
 *
 * @param {import('express').Application} app - The Express application instance.
 * @param {Object} conn - The PostgreSQL database connection object.
 */
module.exports = (app, conn) => {

  /**
   * @function GET /api/fetch_table
   * @description
   * Fetches and returns all rows from a specified table in ascending
   * order by the first column.
   *
   * @route GET /api/fetch_table
   * @query {string} tableName - The name of the database table to query.
   * @returns {Array<Object>} An array of rows from the requested table.
   *
   * @example
   * // Request
   * GET /api/fetch_table?tableName=customers
   *
   * // Response
   * [
   *   { customerid: 'C100000', customername: 'Tal Shaked', ... },
   *   { customerid: 'C100001', customername: 'Eli Azoulay', ... }
   * ]
   */
  app.get('/api/fetch_table', authenticateToken, (req, res, next) => {
    const tableName = req.query.tableName;

    // Construct SQL query dynamically
    const sql = `SELECT * FROM ${tableName} ORDER BY 1 ASC;`;

    console.log(sql);
    conn.query(sql, (err, results) => {
      if (err) {
        console.error('Database query error:', err.message);
        next(err);
        return;
      }
      res.send(results);
    });
  });
};
