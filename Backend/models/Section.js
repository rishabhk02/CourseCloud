const mongoose = require("mongoose");

// Course Sections Model
const sectionSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  sectionName: {
    type: String,
    required: true
  },
  sectionDesc: {
    type: String
  },
  subSections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SubSection",
    },
  ],
  order: {
    type: Number, // Order of the section within the course
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Section", sectionSchema);
