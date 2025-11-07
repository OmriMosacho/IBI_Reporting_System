const express = require('express');
const cors = require('cors');
const { conn } = require('./db/connection.js');
const bodyParser = require('body-parser');

/**
 * Load environment variables from .env file
 */
const dotenv = require('dotenv').config({
    path: './.env',
});
if (dotenv.error) {
    throw dotenv.error;
}

/**
 * Initialize Express app
 */
const app = express();

/**
 * CORS middleware
 */
app.use(cors());

/**
 * Body parser middleware
 */
app.use(express.json());
app.use(bodyParser.json());

/**
 * Routes of fetching raw data, not much of a logic here
 * app - express app
 * conn - database connection
 */
require('./routes/rawData')(app, conn);


/**
 * Start the server on specified port
 */
const app_port = process.env.APP_PORT || 4000;
app.listen(app_port, () => console.log(`Server running on port ${app_port}`));
