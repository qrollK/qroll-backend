const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  year: { type: String },
  department: { type: String },
  division: { type: String },
});

module.exports = mongoose.model('Student', studentSchema);
