/**
 * @file index.js
 * @module server/index
 * @description
 * Entry point for the Express.js backend application.
 * Initializes environment configuration, middleware setup,
 * route registration, and starts the HTTP server.
 */

const express = require('express');
const cors = require('cors');
const { conn } = require('./db/connection.js');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

/**
 * @function loadEnvironment
 * @description
 * Loads environment variables from the `.env` file using dotenv.
 * Throws an error if configuration fails.
 */
const result = dotenv.config({ path: './.env' });
if (result.error) {
  throw result.error;
}

/**
 * @constant {Express.Application} app
 * @description
 * Initializes the Express.js application instance.
 */
const app = express();

/**
 * @middleware CORS
 * @description
 * Enables Cross-Origin Resource Sharing for API requests
 * from different origins (used by the React frontend).
 */
app.use(cors());

/**
 * @middleware JSON and Body Parsing
 * @description
 * Parses incoming request bodies in JSON format and makes
 * them available under `req.body`.
 */
app.use(express.json());
app.use(bodyParser.json());

/**
 * @function registerRoutes
 * @description
 * Registers route modules responsible for handling various
 * API endpoints for data fetching and analytics.
 * 
 * @param {Express.Application} app - Express app instance.
 * @param {Object} conn - PostgreSQL database connection instance.
 */
require('./routes/rawData')(app, conn);     // Raw data fetch routes
require('./routes/analytics')(app, conn);   // Analytical routes
require('./routes/users')(app, conn);       // User management routes


/**
 * @constant {number} app_port
 * @description
 * The port number on which the Express server will listen.
 * Defaults to 4000 if not specified in environment variables.
 */
const app_port = process.env.APP_PORT || 4000;

/**
 * @function startServer
 * @description
 * Starts the Express server and logs a confirmation message
 * to the console once it's successfully running.
 */
app.listen(app_port, () =>
  console.log(`Server running on port ${app_port}...`)
);
