const mongoose = require('mongoose');
const config = require('./config');

const MONGODB_URI = config.mongodbUri;

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
};

async function connect() {
  try {
    await mongoose.connect(MONGODB_URI, opts);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

connect();

module.exports = mongoose;
