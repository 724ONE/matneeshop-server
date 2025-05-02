const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "farihakausar18@gmail.com",
    pass: "ecpn zyak qabl khxq",
  },
});

module.exports = {
  transporter,
};
