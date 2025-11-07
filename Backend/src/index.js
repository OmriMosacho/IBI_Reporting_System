const express = require('express');
const cors = require('cors');
const { conn } = require('./db/connection.js');
const bodyParser = require('body-parser');


const dotenv = require('dotenv').config({
    path: './.env',
});
if (dotenv.error) {
    throw dotenv.error;
}

const app = express();
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());

// Routes
require('./routes/rawData')(app, conn);


app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

const PORT = process.env.APP_PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
