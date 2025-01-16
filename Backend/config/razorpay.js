const Razorpay = require("razorpay");
//**** Razorpay Configuration for Payment Processing ****//
const razorpayInstance = new Razorpay({
	key_id: process.env.RAZORPAY_API_KEY,
	key_secret: process.env.RAZORPAY_SECRETE_KEY,
});

module.exports = razorpayInstance;
