const express = require('express');
const router = express.Router();

// Controller functions for handling ratings and reviews
const { 
    addRatingToCourse, 
    getAverageRatingOfCourse, 
    getAllRatingsAndReviewsOfCourse, 
    deleteMyRatingAndReview 
} = require("../controllers/ratingreview.controller");

// Middleware for authentication and authorization
const { isAuthenticate, isStudent } = require("../middleware/auth.middleware");

// Route to add a rating and review to a course - only accessible by authenticated students
router.post('/rateAndReviewCourse/:courseId', isAuthenticate, isStudent, addRatingToCourse);

// Route to get all ratings and reviews of a specific course
router.get('/getAllRatingsAndReviewsOfCourse/:courseId', getAllRatingsAndReviewsOfCourse);

// Route to get the average rating of a specific course
router.get('/getAverageRatingOfCourse/:courseId', getAverageRatingOfCourse);

// Route to delete a rating and review by ID - only accessible by authenticated students
router.delete('/deleteMyRatingAndReview/:ratingId', isAuthenticate, isStudent, deleteMyRatingAndReview);

module.exports = router;
