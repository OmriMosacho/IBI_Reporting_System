const { Pool } = require('pg');
require('dotenv').config();

const conn = new Pool({
    max: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
});

exports.conn = conn;