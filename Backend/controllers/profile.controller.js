// Import necessary models and utilities
const mongoose = require('mongoose');
const User = require("../models/User");
const Course = require("../models/Course");
const Profile = require("../models/Profile");
const CourseProgress = require("../models/CourseProgress");
const uploadImageToCloudinary = require("../utils/imageUploader");
const convertSecondsToDuration = require("../utils/secToDuration");

// Update profile information
exports.updateProfile = async (req, res) => {
  try {
    const dataToUpdate = req.body;
    const userId = req.user._id;

    // Update user details
    const userDetailToUpdate = {};
    if (req.body.firstName) {
      userDetailToUpdate.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
      userDetailToUpdate.lastName = req.body.lastName;
    }

    const userDetails = await User.findOneAndUpdate({ _id: userId }, { $set: userDetailToUpdate });
    if (!userDetails) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    console.log(req.user._id);

    // Update user profile
    const userProfile = await Profile.findOneAndUpdate({ userId: userId }, { $set: dataToUpdate });
    if (!userProfile) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    const updatedUserDetails = await User.findById(userId).populate("additionalDetails").exec();

    return res.status(200).json({ success: true, message: "Profile updated successfully.", updatedUserDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'An error occurred while updating the profile.' });
  }
}

// Delete user account
exports.deleteAccount = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).session(session);
    return res.status(200);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Delete associated profile
    await Profile.findOneAndDelete({ userId }).session(session);

    // Remove user from courses if they are a student
    if (req.user.role === 'STUDENT') {
      for (const courseId of user.courses) {
        await Course.findByIdAndUpdate(courseId, { $pull: { studentsEnrolled: userId } }).session(session);
      }
    }

    // Delete user and course progress
    await User.findByIdAndDelete(userId).session(session);
    await CourseProgress.deleteMany({ userId }).session(session);

    await session.commitTransaction();

    return res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while deleting the user." });
  } finally{
    session.endSession();
  }
}


// Get user all details
exports.getUserAllDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    let userDetails = await User.findById(userId).populate("additionalDetails");

    if (!userDetails) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    userDetails.password = null;
    return res.status(200).json({ success: true, message: "User details fetched successfully.", userDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'An error occurred while fetching user details.' });
  }
}

// Update profile image
exports.updateProfileImage = async (req, res) => {
  try {
    let { profileImage } = req.files;
    const userId = req.user._id;

    // Upload image to Cloudinary
    profileImage = await uploadImageToCloudinary(profileImage, process.env.IMAGE_UPLOAD_FOLDER_NAME, 1000, 1000);
    const updatedProfile = await User.findByIdAndUpdate(userId, { profileImage: profileImage.secure_url }, { new: true });

    return res.status(200).json({ success: true, message: "Profile image updated successfully.", updatedProfile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'An error occurred while updating the profile image.' });
  }
}

// Get enrolled courses with progress and duration
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user._id;
    let userDetails = await User.findOne({ _id: userId }).populate({
      path: "courses",
      populate: {
        path: "courseContent",
        populate: {
          path: "subSections",
        },
      },
    });
    userDetails = userDetails.toObject();
    let subSectionLength = 0;
    for (let i = 0; i < userDetails?.courses?.length; i++) {
      let totalDurationInSeconds = 0;
      subSectionLength = 0;
      for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSections.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0);
        userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);
        subSectionLength += userDetails.courses[i].courseContent[j].subSections.length;
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      });
      courseProgressCount = courseProgressCount?.completedVideos.length || 0;
      if (subSectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round((courseProgressCount / subSectionLength) * 100 * multiplier) / multiplier;
      }
    }

    if (!userDetails) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({ success: true, message: "Enrolled courses fetched successfully.", data: userDetails.courses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'An error occurred while fetching enrolled courses.' });
  }
}

// Instructor dashboard to get course details
exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user._id });

    const courses = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      return {
        ...course.toObject(),
        totalStudentsEnrolled,
        totalAmountGenerated
      };
    });

    return res.status(200).json({ success: true, message: "Course details fetched successfully.", courses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while fetching course details." });
  }
}
