const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { initializeDatabase } = require("../../../database/db");
const { transporter } = require("../../../lib/transporter");

const login = async (req, res) => {
  try {
    const db = initializeDatabase();
    const { email, password } = req.body;

    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.firstName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  login,
};
