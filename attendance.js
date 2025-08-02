const express = require('express');
const Session = require('../models/Session');
const Attendance = require('../models/Attendance');
const jwt = require('jsonwebtoken');
const router = express.Router();

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

router.post('/submit', authMiddleware, async (req, res) => {
  const { sessionId, enteredToken, location } = req.body;
  const session = await Session.findById(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  // Check token match
  if (enteredToken !== session.token) return res.status(400).json({ error: 'Invalid token' });

  // Save attendance
  const attendance = await Attendance.create({
    session: sessionId,
    student: req.user.id,
    location,
  });

  res.json({ message: 'Attendance marked', attendance });
});

module.exports = router;
