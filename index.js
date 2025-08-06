const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const studentRoutes = require('./routes/student');
const sessionRoutes = require('./routes/sessions');

dotenv.config();
const app = express();

// CORS setup (for local dev + Vercel frontend)
const allowedOrigins = [
  "http://localhost:5173",
  "https://qroll-frontend.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// ✅ Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/session", require("./routes/session"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/student", studentRoutes); // ✅ mount student onboarding route here

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
