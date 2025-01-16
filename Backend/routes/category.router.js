const express = require('express');
const router = express.Router();
const { isAuthenticate, isAdmin } = require('../middleware/auth.middleware');
const { createCategory, showAllCategories, categoryPageDetails } = require('../controllers/category.controller');

// Route to create a new category (requires authentication and admin role)
router.post("/createCategory", isAuthenticate, isAdmin, createCategory);

// Route to show all categories
router.get("/showAllCategories", showAllCategories);

// Route to get details of a specific category page by category ID
router.get("/getCategoryPageDetails/:categoryId", categoryPageDetails);

module.exports = router;
