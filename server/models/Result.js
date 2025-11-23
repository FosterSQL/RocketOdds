const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  color: { type: String, enum: ['red', 'black', 'green'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', ResultSchema);
