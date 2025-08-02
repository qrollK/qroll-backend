const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
});

module.exports = mongoose.model('User', UserSchema);
