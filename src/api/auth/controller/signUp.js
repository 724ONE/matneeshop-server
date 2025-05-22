const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { initializeDatabase } = require("../../../database/db");

const signUp = async (req, res) => {
  try {
    const db = initializeDatabase();
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    await db.promise().query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        firstName VARCHAR(255),
        password VARCHAR(255),
        otp VARCHAR(255),
        resetToken VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    const [existingUsers] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = email.split("@")[0];
    const resetToken = crypto.randomBytes(32).toString("hex");

    await db
      .promise()
      .query(
        "INSERT INTO users (email, firstName, password, resetToken) VALUES (?, ?, ?, ?)",
        [email, username, hashedPassword, resetToken]
      );

    res
      .status(200)
      .json({ message: "Signup successful.", token: resetToken, email });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};

module.exports = { signUp };
