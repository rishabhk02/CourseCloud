const Cart = require('../models/Cart');
const Course = require('../models/Course');


exports.addCourseToCart = async (req, res) => {
    try {
        // Extracting userId from the authenticated user and courseId from the request parameters
        const userId = req.user._id;
        const courseId = req.params.courseId; // Corrected the typo from 'couseId' to 'courseId'

        // Check if the course exists in the database
        const isExist = await Course.findOne({ _id: courseId });
        if (!isExist) {
            return res.status(404).json({ success: false, message: 'Invalid course id.' });
        }

        // Add the course to the user's cart, ensuring no duplicates with $addToSet
        let course = await Cart.findOneAndUpdate(
            { userId },
            { $addToSet: { courses: courseId } },
            { new: true } // Return the modified document
        );

        // Check if the user's cart exists
        if (!course) {
            return res.status(404).json({ success: false, message: 'Invalid user id.' });
        }

        return res.status(200).json({ success: true, message: 'Course added to cart.', course });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getAllCartCourse = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) return res.status(401).json({ success: false, message: 'Invalid User.' });
        const cart = await Cart.findOne({ userId }).populate('courses');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for user.' });
        }
        return res.status(200).json({ message: 'Cart fetched successfully.', courses: cart.courses });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.removeCourseFromCart = async (req, res) => {
    try {
        // Extracting userId from the authenticated user and courseId from the request parameters
        const userId = req.user._id;
        const courseId = req.params.courseId; // Corrected the typo from 'couseId' to 'courseId'

        // Check if the course exists in the database
        const isExist = await Course.findOne({ _id: courseId });
        if (!isExist) {
            return res.status(404).json({ success: false, message: 'Invalid course id.' });
        }

        // Remove the course from the user's cart
        let course = await Cart.findOneAndUpdate(
            { userId },
            { $pull: { courses: courseId } },
            { new: true } // Return the modified document
        );

        // Check if the user's cart exists
        if (!course) {
            return res.status(404).json({ success: false, message: 'Invalid user id.' });
        }

        return res.status(200).json({ success: true, message: 'Course removed from cart.', course });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.emptyCart = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) return res.status(401).json({ message: 'Invalid User.' });
        const cart = await Cart.findOneAndUpdate({ userId }, { $set: { courses: [] } });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for user.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
