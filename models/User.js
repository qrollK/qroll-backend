const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: { type: String, enum: ["student", "teacher"] },
  profile: {
    year: String,
    department: String,
    division: String,
  },
});

module.exports = mongoose.model("User", userSchema);
