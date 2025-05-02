const bcrypt = require("bcrypt");
const { initializeDatabase } = require("../../../database/db");
const passwordSet = async (req, res) => {
  try {
    const db = initializeDatabase();
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
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
      .query(
        "SELECT * FROM users WHERE resetToken = ? AND tokenExpires > NOW()",
        [token]
      );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    const user = rows[0];

    // Step 3: Hash password and update DB
    const hashedPassword = await bcrypt.hash(password, 10);

    await db
      .promise()
      .query(
        "UPDATE users SET password = ?, resetToken = NULL, tokenExpires = NULL, updatedAt = NOW() WHERE id = ?",
        [hashedPassword, user.id]
      );

    // Step 4: Success response
    res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = {
  passwordSet,
};
