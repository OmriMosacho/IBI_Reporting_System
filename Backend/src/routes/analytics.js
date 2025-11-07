/**
 * @file analytics.js
 * @module routes/analytics
 * @description
 * Provides analytical endpoints for customers, companies, and stock price data.
 * Each endpoint performs SQL aggregations and returns preprocessed data for dashboard visualization.
 */

/**
 * @requires ../services - Shared backend services including JWT authentication middleware.
 */
const { authenticateToken } = require('../services');

/**
 * @function module.exports
 * @description
 * Registers analytics route handlers to the given Express app.
 *
 * @param {import('express').Application} app - Express application instance.
 * @param {Object} conn - PostgreSQL database connection object.
 */
module.exports = (app, conn) => {

  // ---------------------------------------------------------------------------
  // CUSTOMER ANALYTICS
  // ---------------------------------------------------------------------------

  /**
   * @function GET /api/analytics/customers/avg-tenure
   * @description
   * Retrieves the average customer tenure (in years) grouped by customer segment.
   * Used for analyzing retention and loyalty across different customer segments.
   * @returns {Array<{segment: string, avg_tenure: number}>}
   */
  app.get('/api/customers/avg-tenure', authenticateToken, (req, res, next) => {
    const sql = `
      SELECT segment, ROUND(AVG(tenureyears)::numeric, 2) AS avg_tenure
      FROM customers
      GROUP BY segment
      ORDER BY avg_tenure DESC;
    `;

    console.log(sql);
    conn.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching customer tenure analytics:', err);
        next(err);
        return;
      }
      res.send(results.rows || results);
    });
  });

  /**
   * @function GET /api/analytics/customers/monthly-joins
   * @description
   * Returns the number of customers who joined per month,
   * providing a trend of customer acquisition over time.
   * @returns {Array<{month: string, new_customers: number}>}
   */
  app.get('/api/customers/monthly-joins', authenticateToken, (req, res, next) => {
    const sql = `
      SELECT TO_CHAR(joindate, 'YYYY-MM') AS month, COUNT(*) AS new_customers
      FROM customers
      GROUP BY 1
      ORDER BY 1;
    `;

    console.log(sql);
    conn.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching monthly join data:', err);
        next(err);
        return;
      }
      res.send(results.rows || results);
    });
  });


  // ---------------------------------------------------------------------------
  // COMPANY ANALYTICS
  // ---------------------------------------------------------------------------

  /**
   * @function GET /api/analytics/companies/by-sector-country
   * @description
   * Returns the count of companies grouped by sector and country.
   * Useful for understanding geographic and industry distribution.
   * @returns {Array<{country: string, sector: string, company_count: number}>}
   */
  app.get('/api/companies/by-sector-country', authenticateToken, (req, res, next) => {
    const sql = `
      SELECT country, sector, COUNT(*) AS company_count
      FROM companies
      GROUP BY country, sector
      ORDER BY country, sector;
    `;

    console.log(sql);
    conn.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching company sector-country distribution:', err);
        next(err);
        return;
      }
      res.send(results.rows || results);
    });
  });

  /**
   * @function GET /api/analytics/companies/currency-distribution
   * @description
   * Returns the number of companies operating under each trading currency.
   * Used to evaluate exposure to various currencies.
   * @returns {Array<{currency: string, company_count: number}>}
   */
  app.get('/api/companies/currency-distribution', authenticateToken, (req, res, next) => {
    const sql = `
      SELECT currency, COUNT(*) AS company_count
      FROM companies
      GROUP BY currency
      ORDER BY company_count DESC;
    `;
    console.log(sql);
    conn.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching company currency distribution:', err);
        next(err);
        return;
      }
      res.send(results.rows || results);
    });
  });


  // ---------------------------------------------------------------------------
  // STOCK PRICE ANALYTICS
  // ---------------------------------------------------------------------------

  /**
   * @function GET /api/analytics/stocks/price-trend
   * @description
   * Returns average daily closing prices for each stock ticker (or a specific ticker if provided).
   * Useful for visualizing price trends over time.
   * @query {string} [ticker] - Optional ticker filter for a single stock.
   * @returns {Array<{ticker: string, trade_date: string, avg_close: number}>}
   */
  app.get('/api/stocks/price-trend', authenticateToken, (req, res, next) => {
    const ticker = req.query.ticker;
    const sql = `
      SELECT ticker,
             TO_DATE(date, 'DD/MM/YYYY') AS trade_date,
             ROUND(AVG(close)::numeric, 2) AS avg_close
      FROM stock_prices
      ${ticker ? `WHERE ticker = '${ticker}'` : ''}
      GROUP BY ticker, trade_date
      ORDER BY trade_date;
    `;

    console.log(sql);
    conn.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching stock price trend:', err);
        next(err);
        return;
      }
      res.send(results.rows || results);
    });
  });

  /**
   * @function GET /api/analytics/stocks/volatility
   * @description
   * Returns the price range (volatility) for each stock ticker.
   * Volatility = MAX(close) - MIN(close)
   * @returns {Array<{ticker: string, price_range: number}>}
   */
  app.get('/api/stocks/volatility', authenticateToken, (req, res, next) => {
    const sql = `
      SELECT ticker, ROUND(MAX(close) - MIN(close), 2) AS price_range
      FROM stock_prices
      GROUP BY ticker
      ORDER BY price_range DESC;
    `;
    console.log(sql);
    conn.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching stock volatility:', err);
        next(err);
        return;
      }
      res.send(results.rows || results);
    });
  });
};
