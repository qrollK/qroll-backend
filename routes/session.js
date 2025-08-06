const express = require('express');
const Session = require('../models/Session');
const jwt = require('jsonwebtoken');
const router = express.Router();

// ✅ Auth middleware
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

// ✅ Generate a random 6-digit token
function generateToken() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ✅ Create new session
router.post('/create', authMiddleware, async (req, res) => {
  const { title, location, expiresAt } = req.body;

  const token = generateToken();
  const session = await Session.create({
    createdBy: req.user.id,
    title,
    location,
    token,
    expiresAt,
  });

  res.json(session);
});

// ✅ Rotate token (called by frontend every few seconds)
router.get('/:id/token', authMiddleware, async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  session.token = generateToken();
  await session.save();

  res.json({ token: session.token });
});

// ✅ NEW: Get active sessions
router.get('/active', authMiddleware, async (req, res) => {
  try {
    const now = new Date();

    // Find sessions that haven't expired
    const sessions = await Session.find({ expiresAt: { $gte: now } });

    res.json({ sessions });
  } catch (err) {
    console.error("Error fetching active sessions:", err);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
});

module.exports = router;
