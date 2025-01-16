const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerification");

// Email Verification OTP Schema
const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},
});

// Creating a function to send the otp
async function sendVerificationEmail(email, otp) {
	try {
		const mailResponse = await mailSender(email, "Email Verfication", emailTemplate(otp));
	} catch (error) {
		console.error("Error while sending mail for otp", error);
	}
}

// Define a post-save hook (post-middleware) to send email after the document has been saved
OTPSchema.pre("save", async function (next) {
	// Only send an email when a new document is created
	if (this.isNew) {
		console.log(this.otp);
		// await sendVerificationEmail(this.email, this.otp);
	}
	next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
