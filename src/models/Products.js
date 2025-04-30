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
      unique: true, // Make the username field unique
    },
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
  { collection: "admins", strict: false, timestamps: true }
);

const User = mongoose.model("Users", userSchema);

module.exports = {
  User,
};
