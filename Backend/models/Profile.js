const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	gender: {
		type: String,
	},
	dateOfBirth: {
		type: String,
	},
	about: {
		type: String,
		trim: true,
	},
	mobileNumber: {
		type: Number,
		trim: true,
	},
	address: {
		type: String,
		trim: true,
	},
	socialLinks: {
		type: [String],
	},
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);
