const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    forgotOtp: {
      type: String,
    },
    resetToken: String,
    tokenExpires: Date,

    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    profileImage: {
      type: String,
    },
  },
  { collection: "users", strict: false, timestamps: true }
);

const User = mongoose.model("Users", userSchema);

module.exports = {
  User,
};
