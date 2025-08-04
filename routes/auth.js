const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
router.post('/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub, name, email } = ticket.getPayload();
    let user = await User.findOne({ googleId: sub });
    let isNewUser = false;

    if (!user) {
      user = await User.create({ googleId: sub, name, email, role: null });
      isNewUser = true;
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: jwtToken,
      user,
      isNewUser,
    });

  } catch (err) {
    console.error('❌ Google auth error:', err);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

// POST /api/auth/set-role
router.post('/set-role', async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { role } = req.body;

    if (!["student", "teacher"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { role },
      { new: true }
    );

    const newToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ user, token: newToken });
  } catch (err) {
    console.error('❌ Set role error:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;
