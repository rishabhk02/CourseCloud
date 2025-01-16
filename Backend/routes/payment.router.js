const express = require("express");
const router = express.Router();

// Controller functions for handling payments
const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/payment.controller");

// Middleware for authentication
const { isAuthenticate } = require("../middleware/auth.middleware");

// Route to capture payment - only accessible by authenticated users
router.post("/capturePayment", isAuthenticate, capturePayment);

// Route to verify payment - only accessible by authenticated users
router.post("/verifyPayment", isAuthenticate, verifyPayment);

// Route to send a payment success email - only accessible by authenticated users
router.post("/sendPaymentSuccessEmail", isAuthenticate, sendPaymentSuccessEmail);

module.exports = router;
