const { initializeDatabase } = require("../../../database/db");

const verifyOtp = async (req, res) => {
  try {
    const db = initializeDatabase();
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required.",
        success: false,
      });
    }

    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", [email]);

    const user = users[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    // Optionally clear OTP after verification
    await db
      .promise()
      .query("UPDATE users SET otp = NULL WHERE id = ?", [user.id]);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    const message =
      error.message || "An error occurred during OTP verification.";
    console.error("verifyOtp error:", error);
    res.status(500).json({
      message,
      success: false,
    });
  }
};

module.exports = { verifyOtp };
