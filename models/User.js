const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: String,
  email: { type: String, required: true, unique: true },
  name: String,
  picture: String,
  role: { type: String, enum: ["student", "teacher", null], default: null },
});

module.exports = mongoose.model("User", userSchema);
