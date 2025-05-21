const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { initializeDatabase } = require("../../../database/db");
const { transporter } = require("../../../lib/transporter");

const signUp = async (req, res) => {
  try {
    const db = initializeDatabase();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    await db.promise().query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    firstName VARCHAR(255),
    password VARCHAR(255),
    resetToken VARCHAR(255),
    tokenExpires DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
`);

    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length > 0) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const username = email.split("@")[0];

    await db
      .promise()
      .query("INSERT INTO users (email, firstName) VALUES (?, ?)", [
        email,
        username,
      ]);

    const [newUsers] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    const user = newUsers[0];

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 3600000); // 1 hour

    await db
      .promise()
      .query("UPDATE users SET resetToken = ?, tokenExpires = ? WHERE id = ?", [
        token,
        tokenExpires,
        user.id,
      ]);

    const resetLink = `https://www.matineeshop.com/reset-password?token=${token}`;

    const mailOptions = {
      from: "farihakausar18@gmail.com",
      to: email,
      subject: "Il tuo account Matinée è stato creato.",
      html: `
        <p>Benvenuto in Matinée</p>
        <p>Grazie per aver creato un account su <strong>Matinée</strong>. Il tuo nome utente è <strong>${user.firstName}</strong></p>
        <p><a href="${resetLink}">Clicca qui per impostare la tua nuova password</a>.</p>
        <p>Puoi accedere al tuo account per vedere gli ordini e cambiare la password da qui: 
        <a href="https://www.matineeshop.com/mio-account/">https://www.matineeshop.com/mio-account/</a></p>
        <p>Non vediamo l'ora di vederti.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Signup successful. Check your email to set your password.",
      token: token,
      tokenExpires: tokenExpires,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};

module.exports = {
  signUp,
};
