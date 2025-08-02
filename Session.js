const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  token: String,
  expiresAt: Date,
  location: {
    lat: Number,
    lng: Number
  },
});

module.exports = mongoose.model('Session', SessionSchema);
