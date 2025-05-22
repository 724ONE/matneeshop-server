const bcrypt = require("bcrypt");
const { initializeDatabase } = require("../../../database/db");

const passwordSet = async (req, res) => {
  try {
    const db = initializeDatabase();
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const [rows] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found with the provided email.",
      });
    }

    const user = rows[0];

    const hashedPassword = await bcrypt.hash(password, 10);

    await db
      .promise()
      .query(
        "UPDATE users SET password = ?, resetToken = NULL, updatedAt = NOW() WHERE id = ?",
        [hashedPassword, user.id]
      );

    res.status(200).json({
      success: true,
      message: "Password has been updated successfully.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = { passwordSet };
