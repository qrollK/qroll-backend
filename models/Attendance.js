const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  location: {
    lat: Number,
    lng: Number
  }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
