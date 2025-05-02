const express = require("express");
const { signUp } = require("./controller/signUp");
const { login } = require("./controller/login");
const { passwordSet } = require("./controller/passwordSet");
const { verifyEmailForgot } = require("./controller/verifyEmailForgot");

const router = express.Router();

router.post("/signUp", signUp);
router.post("/login", login);
router.post("/passwordSet", passwordSet);
router.post("/verifyEmail", verifyEmailForgot);
module.exports = router;
