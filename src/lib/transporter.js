const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "malikazhan292@gmail.com",
    pass: "ymhaxkunobuimdpf",
  },
})

module.exports = {
  transporter,
}
