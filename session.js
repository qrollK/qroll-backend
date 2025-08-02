const express = require('express');
const Session = require('../models/Session');
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

// Generate a random 6-digit token
function generateToken() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

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

// Refresh QR token every time frontend polls
router.get('/:id/token', authMiddleware, async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  // Update token every 5s (simplified for demo)
  session.token = generateToken();
  await session.save();

  res.json({ token: session.token });
});

module.exports = router;
