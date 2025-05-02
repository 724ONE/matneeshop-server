const crypto = require("crypto");
const { initializeDatabase } = require("../../../database/db");
const { transporter } = require("../../../lib/transporter");

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
        user: null,
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 3600000);
    const resetLink = `https://www.matineeshop.com/reset-password?token=${token}`;

    await db
      .promise()
      .query("UPDATE users SET resetToken = ?, tokenExpires = ? WHERE id = ?", [
        token,
        tokenExpires,
        user.id,
      ]);

    const mailOptions = {
      from: "farihakausar18@gmail.com",
      to: email,
      subject: "Password Reset Instructions for Matinée",
      html: `
        <p><strong>Password Reset Instructions</strong></p>
        <p>Someone has requested a password reset for the following account:</p>
        <p><strong>Username:</strong> ${user.firstName}</p>
        <p>If this was a mistake, simply ignore this email and nothing will happen.</p>
        <p>To reset your password, please click the link below:</p>
        <p><a href="${resetLink}">Click here to reset your password</a></p>
        <p>Thank you.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Password reset instructions sent successfully.",
    });
  } catch (error) {
    const message = error.message || "We are working to fix this problem";
    res.status(500).json({
      message,
      success: false,
    });
  }
};

module.exports = {
  verifyEmailForgot,
};
