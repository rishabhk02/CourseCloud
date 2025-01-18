const mongoose = require("mongoose");

// Course Subsections Model
const SubSectionSchema = new mongoose.Schema({
	courseId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Course",
		required: true
	},
	sectionId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Section",
		required: true
	},
	title: {
		type: String,
		required: true
	},
	timeDuration: {
		type: String
	},
	description: {
		type: String,
		required: true
	},
	videoUrl: {
		type: String
	},
	order: {
		type: Number, // Order of the subsection within the section
		// required: true,
	},
}, { timestamps: true });

module.exports = mongoose.model("SubSection", SubSectionSchema);
