const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/session', require('./routes/session'));
app.use('/api/attendance', require('./routes/attendance'));
app.use("/auth", authRoutes);


// DB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
