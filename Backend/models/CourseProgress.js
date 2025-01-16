const mongoose = require("mongoose");

// Course Progress Tracking Model
const courseProgressSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
  progressPercentage: {
    type: Number,
    default: 0, // Percentage of course completion
  },
  lastAccessed: {
    type: Date,
    default: Date.now, // Last accessed date
  },
  startedAt: {
    type: Date,
    default: Date.now, // Course start date
  },
  completedAt: {
    type: Date, // Course completion date
  },
}, { timestamps: true });

const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);

module.exports = CourseProgress;
