const crypto = require("crypto");
const { initializeDatabase } = require("../../../database/db");
const { transporter } = require("../../../lib/transporter");
const { getOTP } = require("../../../lib/exports");

const verifyEmailForgot = async (req, res) => {
  try {
    const db = initializeDatabase();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please provide a valid email.",
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
        message: "No user found.",
      });
    }

    const otp = await getOTP();

    await db
      .promise()
      .query("UPDATE users SET otp = ? WHERE id = ?", [otp, user.id]);

    await transporter.sendMail({
      from: '"Your App Name" <no-reply@yourdomain.com>',
      to: email,
      subject: "Your OTP Code for Password Reset",
      html: `
        <p>Hello,</p>
        <p>Your OTP for password reset is:</p>
        <h2>${otp}</h2>
        <p>Please enter this OTP to proceed. It is valid for a short time.</p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    });

    res.status(200).json({
      message: "OTP sent to email successfully.",
      success: true,
    });
  } catch (error) {
    const message = error.message || "We are working to fix this problem";
    console.error("verifyEmailForgot error:", error);
    res.status(500).json({
      message,
      success: false,
    });
  }
};

module.exports = { verifyEmailForgot };
