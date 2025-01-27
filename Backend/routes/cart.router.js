const express = require('express');
const router = express.Router();
const { isAuthenticate } = require('../middleware/auth.middleware');
const { addCourseToCart, getAllCartCourse, removeCourseFromCart, emptyCart } = require('../controllers/cart.controller');

// Add course to cart
router.post('/addCourseToCart/:courseId', isAuthenticate, addCourseToCart);

// Get all cart items
router.get('/getAllCartCourse', isAuthenticate, getAllCartCourse);

// Remove item from cart
router.put('/removeCourseFromCart/:courseId', isAuthenticate, removeCourseFromCart);

// Empty whole cart
router.put('/emptyCart', isAuthenticate, emptyCart);

module.exports = router;