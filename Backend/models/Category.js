const mongoose = require("mongoose");

// Course Category/Domain Model
const categorySchema = new mongoose.Schema({
	categoryName: {
		type: String,
		required: true,
	},
	description: { type: String },
	courses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
		},
	],
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
