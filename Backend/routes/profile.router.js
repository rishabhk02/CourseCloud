// Import necessary modules
const express = require("express");
const router = express.Router();

// Import middleware functions for authentication and role checking
const { isAuthenticate, isInstructor } = require("../middleware/auth.middleware");

// Import controller functions for handling profile-related operations
const {
  updateProfile,
  deleteAccount,
  getUserAllDetails,
  updateProfileImage,
  getEnrolledCourses,
  instructorDashboard
} = require("../controllers/profile.controller");

// Route to update profile details, protected by authentication
router.put('/updateProfileDetail', isAuthenticate, updateProfile);

// Route to update profile image, protected by authentication
router.put('/updateProfileImage', isAuthenticate, updateProfileImage);

// Route to get all user details, protected by authentication
router.get('/getUserAllDetails', isAuthenticate, getUserAllDetails);

// Route to get enrolled courses, protected by authentication
router.get("/getEnrolledCourses", isAuthenticate, getEnrolledCourses);

// Route for instructor dashboard, protected by authentication and instructor role
router.get("/instructorDashboard", isAuthenticate, isInstructor, instructorDashboard);

// Route to delete account, protected by authentication
router.delete('/deleteAccount', isAuthenticate, deleteAccount);

// Export the router object for use in other parts of the application
module.exports = router;
