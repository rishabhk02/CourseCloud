// Import Express and create a new router object
const express = require('express');
const router = express.Router();

// Import middleware functions for authentication and role checking
const { isAuthenticate, isInstructor } = require('../middleware/auth.middleware');

// Import controller functions for handling section operations
const { createSection, updateSection, deleteSection } = require("../controllers/section.controller");

// Route to add a section, protected by authentication and instructor role
router.post('/addSection', isAuthenticate, isInstructor, createSection);

// Route to update a section, protected by authentication and instructor role
router.post("/updateSection", isAuthenticate, isInstructor, updateSection);

// Route to delete a section, protected by authentication and instructor role
router.delete("/deleteSection", isAuthenticate, isInstructor, deleteSection);

// Export the router object for use in other parts of the application
module.exports = router;