const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub, name, email } = ticket.getPayload();

    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = await User.create({ googleId: sub, name, email });
    }

    const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: jwtToken, user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid Google Token' });
  }
});

module.exports = router;
