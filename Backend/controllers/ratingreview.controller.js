const Course = require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");

exports.addRatingToCourse = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const courseId = req.params.courseId;
    const { rating, review } = req.body;

    if (rating > 5 || rating < 1) {
      return res.status(400).json({ success: false, message: 'Invalid rating value.' });
    }

    // Check for student enrollment in course
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    }).session(session);

    if (!courseDetails) {
      return res.status(403).json({ success: false, message: "Only enrolled students can review and rate the course." });
    }

    // Check if the user has already reviewed the course
    const isReviewed = await RatingAndReview.findOne({ user: userId, course: courseId }).session(session);

    if (isReviewed) {
      return res.status(403).json({ success: false, message: "Course has already been reviewed by user." });
    }

    // Create a new rating and review
    const newRatingReview = await RatingAndReview.create([{
      userId,
      courseId,
      rating,
      review
    }], { session });

    // Add the rating and review to the course
    await Course.findByIdAndUpdate(courseId, {
      $push: {
        ratingAndReviews: newRatingReview,
      },
    }).session(session);

    await session.commitTransaction();

    return res.status(201).json({ success: true, message: "Rating and review added successfully.", newRatingReview });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    return res.status(500).json({ success: false, message: "An error occurred while adding rating/review." });
  } finally {
    session.endSession();
  }
};

exports.getAverageRatingOfCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Calculate the average rating using the MongoDB aggregation pipeline
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          courseId
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({ success: true, averageRating: result[0].averageRating });
    }
    return res.status(200).json({ success: true, averageRating: 0 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch the average rating for the course." });
  }
};

exports.getAllRatingsAndReviewsOfCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const allRatingsAndReviews = await RatingAndReview.find({ courseId }).populate({
      path: "userId",
      select: "firstName lastName profileImage"
    });
    return res.status(200).json({ success: true, allRatingsAndReviews, message: "Ratings and reviews fetched successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch all ratings and review of course." });
  }
}

exports.deleteMyRatingAndReview = async (req, res) => {
  try {
    const ratingId = req.params.ratingId;
    const userId = req.user.userId;
    const ratingAndReview = await RatingAndReview.findOneAndDelete({ _id: ratingId, userId });
    if(ratingAndReview){
      return res.status(200).json({success: true, message: 'Rating deleted successfully.'});
    }
    return res.status(403).json({success: false, message: 'You are not allowed to delete rating.'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to delete rating and review.' });
  }
}
