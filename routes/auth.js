const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @route   POST /api/auth/google
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ email });

    const isNewUser = !user;

    if (!user) {
      user = new User({
        googleId: sub,
        email,
        name,
        picture,
        role: null, // Ask later
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token: jwtToken,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
      },
      isNewUser,
    });
  } catch (err) {
    console.error("Google login error", err);
    res.status(500).json({ message: "Google login failed" });
  }
});

// @route POST /api/auth/set-role
router.post("/set-role", async (req, res) => {
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
      expiresIn: "7d",
    });

    res.json({ user, token: newToken });
  } catch (err) {
    console.error("Set role error:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;
