require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');
const spinRouter = require('./routes/spin');
const usersRouter = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = config.port;

// show which URI will be used (masked)
const maskedUri = String(config.mongodbUri || '').replace(/:(?:[^:@]+)@/, ':*****@');
console.log('Using MongoDB URI:', maskedUri ? maskedUri : '<<not set>>');

// centralize DB connection
require('./db');

app.use('/api/spin', spinRouter);
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'RocketOdds server running' });
});

// health check for quick probing
app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
