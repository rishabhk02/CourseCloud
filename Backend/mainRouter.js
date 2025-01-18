const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.router');
const categoryRoutes = require('./routes/category.router');
const contactRoutes = require('./routes/contact.router');
const courseRoutes = require('./routes/course.router');
const paymentRoutes = require('./routes/payment.router');
const profileRoutes = require('./routes/profile.router');
const ratingReviewRoutes = require('./routes/ratingReview.router');
const sectionRoutes = require('./routes/section.router');
const subsectionRoutes = require('./routes/subsection.router');

// Setting up routes
app.use('/auth', authRoutes);
app.use('/category', categoryRoutes);
app.use("/contact", contactRoutes);
app.use("/course", courseRoutes);
app.use("/payment", paymentRoutes);
app.use("/profile", profileRoutes);
app.use("/ratingreview", ratingReviewRoutes);
app.use('/section', sectionRoutes);
app.use('/subsection', subsectionRoutes);

module.exports = app;