const express = require("express");
const router = express.Router();

// Middleware for authentication and authorization
const { isAuthenticate, isAdmin, isInstructor, isStudent } = require('../middleware/auth.middleware');

// Controller functions
const { 
    createCourse, 
    editCourse, 
    getAllCourses, 
    getCourseDetails, 
    getCourseContent, 
    getInstructorCourses, 
    deleteCourse 
} = require('../controllers/course.controller');
const { updateCourseProgress } = require("../controllers/courseProgress.controller");

// Route to create a new course - only accessible by authenticated instructors
router.post("/createCourse", isAuthenticate, isInstructor, createCourse);

// Route to update course progress - only accessible by authenticated students
router.post("/updateCourseProgress", isAuthenticate, isStudent, updateCourseProgress);

// Route to edit a course - only accessible by authenticated instructors
router.put("/editCourse", isAuthenticate, isInstructor, editCourse);

// Route to get the details of a specific course
router.get("/getCourseDetails/:courseId", getCourseDetails);

// Route to get the content of a specific course - only accessible by authenticated users
router.get("/getCourseContent/:courseId", isAuthenticate, getCourseContent);

// Route to get all available courses
router.get("/getAllCourses", getAllCourses);

// Route to get courses created by a specific instructor - only accessible by authenticated instructors
router.get("/getInstructorCourses", isAuthenticate, isInstructor, getInstructorCourses);

// Route to delete a specific course - only accessible by authenticated instructors
router.delete("/deleteCourse/:courseId", isAuthenticate, isInstructor, deleteCourse);

module.exports = router;
