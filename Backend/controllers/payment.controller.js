const crypto = require("crypto");
const User = require("../models/User");
const Course = require("../models/Course");
const mailSender = require("../utils/mailSender");
const razorpayInstance = require("../config/razorpay");
const CourseProgress = require("../models/CourseProgress");
const paymentSuccessEmailTemplate = require("../mail/templates/paymentSuccess");
const courseEnrollmentEmailTemplate = require("../mail/templates/courseEnrollmentConfirmation");

// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  const userId = req.user._id;
  const courses = req.body.courses;

  // Check if courses array is empty
  if (!courses || courses.length === 0) {
    return res.status(400).json({ success: false, message: "Please provide courseId." });
  }

  let total_amount = 0;
  for (const courseId of courses) {
    try {
      // Find the course by its ID
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(400).json({ success: false, message: "Invalid courseId." });
      }

      // Check if the student is already enrolled in the course
      if (course.studentsEnrolled.includes(userId)) {
        return res.status(400).json({ success: false, message: "Student is already enrolled in the course." });
      }

      // Add the price of the course to the total amount
      total_amount += course.price;
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Could not initiate Razorpay payment order." });
    }
  }

  // Options for Razorpay order
  const options = {
    amount: total_amount * 100, // Amount in paise
    currency: "INR",
    receipt: Math.random().toString(36).substring(2), // Generate a random receipt string
  };

  // Initiate the payment using Razorpay
  try {
    const paymentResponse = await razorpayInstance.orders.create(options);
    return res.status(200).json({ success: true, paymentResponse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Could not initiate Razorpay payment order." });
  }
};

// Payment Verification
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses } = req.body;
  const userId = req.user._id;

  // Check if any of the required fields are missing
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
    return res.status(400).json({ success: false, message: "Payment Failed! Please try again." });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  // Generate the expected signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRETE_KEY)
    .update(body.toString())
    .digest("hex");

  // Verify the signature
  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res);
    return res.status(200).json({ success: true, message: "Payment Successful." });
  } else {
    return res.status(400).json({ success: false, message: "Payment Failed! Please try again." });
  }
};

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user._id;

  // Check if any of the required fields are missing
  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({ success: false, message: "Please provide all the details." });
  }

  try {
    // Find the user by ID
    const enrolledStudent = await User.findById(userId);

    // Send payment success email
    await mailSender(
      enrolledStudent.email,
      "Payment Received",
      paymentSuccessEmailTemplate(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );

    return res.status(200).json({ success: true, message: "Payment success email sent." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while sending payment success email." });
  }
};

// Enroll students in the course
const enrollStudents = async (courses, userId, res) => {
  if (!courses || courses.length === 0 || !userId) {
    return res.status(400).json({ success: false, message: "Please provide the valid courseId and userId." });
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(404).json({ success: false, message: "Invalid Course." });
      }

      // Create course progress for the student
      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      // Update the user's enrolled courses and course progress
      await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      // Send an email notification to the enrolled student
      await mailSender(
        enrolledCourse.email,
        `Successfully Enrolled in ${enrolledCourse.courseName}`,
        courseEnrollmentEmailTemplate(
          enrolledCourse.courseName,
          `${enrolledCourse.firstName} ${enrolledCourse.lastName}`
        )
      );

    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Failed to enroll student in course." });
    }
  }
};
