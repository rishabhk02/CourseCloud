const mongoose = require("mongoose");

// Course Detail Model
const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true
  },
  courseDescription: {
    type: String,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  whatYouWillLearn: {
    type: String,
    required: true
  },
  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  price: {
    type: Number,
    required: true
  },
  thumbnail: {
    type: String,
  },
  tags: {
    type: [String],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
  instructions: {
    type: [String],
    required: true
  },
  status: {
    type: String,
    enum: ["DRAFT", "PUBLISHED"],
    default: "DRAFT"
  },
  language: {
    type: String,
    // required: true,
  },
  level: {
    type: String,
    enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
    // required: true,
  },
  duration: {
    type: Number, // Duration in hours
    required: true,
  },
  benefits: [{
    type: String
  }]
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
