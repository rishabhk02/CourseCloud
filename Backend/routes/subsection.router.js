// Import Express and create a new router object
const express = require('express');
const router = express.Router();

// Import middleware functions for authentication
const { isAuthenticate, isInstructor } = require('../middleware/auth.middleware');

// Import controller functions for handling sub-section operations
const { createSubSection, updateSubSection, deleteSubSection } = require('../controllers/subsection.controller');

// Route to add a sub-section, protected by authentication and instructor role
router.post("/addSubSection", isAuthenticate, isInstructor, createSubSection);

// Route to update a sub-section, protected by authentication and instructor role
router.post("/updateSubSection", isAuthenticate, isInstructor, updateSubSection);

// Route to delete a sub-section, protected by authentication and instructor role
router.delete("/deleteSubSection", isAuthenticate, isInstructor, deleteSubSection);

// Export the router object for use in other parts of the application
module.exports = router;
