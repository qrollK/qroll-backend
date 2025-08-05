const axios = require("axios");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    const { email, name, picture } = response.data;

    req.user = { email, name, picture };
    next();
  } catch (error) {
    console.error("Invalid token", error.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
