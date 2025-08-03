const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  const { token, role } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // TODO: You can check/insert user in DB here if needed

    const jwtToken = jwt.sign({ email, name, picture, role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token: jwtToken, role, name });
  } catch (err) {
    console.error("Google login error", err);
    res.status(401).json({ message: "Invalid Google token" });
  }
};

module.exports = { googleLogin };