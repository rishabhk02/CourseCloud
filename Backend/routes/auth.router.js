const express = require("express");
const router = express.Router();
const {
  register,
  login,
  sendEmailVerificationOtp,
  changePassword,
  resetPassword,
  resetPasswordToken,
  checkIsTokenValid
} = require('../controllers/auth.controller');
const { isAuthenticate } = require("../middleware/auth.middleware");

// Route for user login
router.post("/login", login);

// Route for user registration
router.post("/register", register);

// Route for sending OTP for email verification during registration
router.post("/sendEmailVerificationOtp", sendEmailVerificationOtp);

// Route for changing password (requires authentication)
router.post("/changePassword", isAuthenticate, changePassword);

// Route for generating a reset password token
router.post("/resetPasswordToken", resetPasswordToken);

// Route for resetting user's password after verification
router.post("/resetPassword", resetPassword);

// Route for checking token is valid or not
router.get("/checkIsTokenValid", isAuthenticate, checkIsTokenValid);

module.exports = router;
