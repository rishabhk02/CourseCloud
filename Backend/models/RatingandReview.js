const mongoose = require("mongoose");

// Course Rating and Review Model
const ratingAndReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
    index: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);
