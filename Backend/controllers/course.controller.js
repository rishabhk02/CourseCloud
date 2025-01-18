const mongoose = require("mongoose");
const User = require("../models/User");
const Course = require("../models/Course");
const Section = require("../models/Section");
const Category = require("../models/Category");
const SubSection = require("../models/Subsection");
const CourseProgress = require("../models/CourseProgress");
const uploadImageToCloudinary = require("../utils/imageUploader");
const convertSecondsToDuration = require("../utils/secToDuration");

// Create new course 
exports.createCourse = async (req, res) => {
  const session = await mongoose.startSession(); session.startTransaction(); try {
    const userId = req.user._id;
    // Get all required fields
    let { courseName, courseDescription, whatYouWillLearn, price, duration, tags, category, status, instructions } = req.body;

    // Get thumbnail image from request files
    const thumbnail = req.files.thumbnail;

    // Check if any of the required fields are missing
    if (!courseName || !courseDescription || !whatYouWillLearn || !price || !duration || !thumbnail || !category) {
      return res.status(400).json({ success: false, message: "Mandatory fields are required." });
    }
    if (!status || status === undefined) {
      status = "DRAFT";
    }

    // Check if the user is an instructor
    const instructorDetails = await User.findById(userId).session(session);
    if (!instructorDetails || instructorDetails.userRole !== "INSTRUCTOR") {
      return res.status(403).json({ success: false, message: "Only registered instructors can add courses." });
    }

    // Check if the course category is valid
    const categoryDetails = await Category.findById(category).session(session);
    if (!categoryDetails) {
      return res.status(404).json({ success: false, message: "Invalid course category." });
    }

    // Upload the thumbnail to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.IMAGE_UPLOAD_FOLDER_NAME);

    // Create the new course
    const newCourse = await Course.create([{
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      thumbnail: thumbnailImage.secure_url,
      tags,
      category,
      duration,
      instructions,
      status,
    }], { session });

    // Add course to instructor
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse[0]._id } },
      { new: true, session }
    );

    // Add course to its category
    await Category.findByIdAndUpdate(
      category,
      { $push: { courses: newCourse[0]._id } },
      { new: true, session }
    );

    await session.commitTransaction();
    return res.status(201).json({ success: true, newCourse: newCourse[0], message: "Course created successfully!" });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to create course!" });
  }
  finally {
    session.endSession();
  }
};


// Edit Course Details 
exports.editCourse = async (req, res) => {
  const session = await mongoose.startSession(); session.startTransaction(); try {
    const _id = req.params.courseId;
    const updatedDetails = req.body;
    const course = await Course.findById(_id).session(session);
    // Check if the course exists
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    // Check if the user is authorized to edit the course
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access." });
    }

    // If thumbnail image is found, update it
    if (req.files) {
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.IMAGE_UPLOAD_FOLDER_NAME);
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update only the fields that are present in the request body
    for (const key in updatedDetails) {
      if (updatedDetails.hasOwnProperty(key)) {
        course[key] = updatedDetails[key];
      }
    }
    await course.save({ session });

    const updatedCourse = await Course.findOne({ _id }).populate({
      path: "instructor",
      populate: { path: "additionalDetails" },
    }).populate("category").populate("ratingAndReviews").populate({
      path: "courseContent",
      populate: { path: "subSections" },
    }).session(session);

    await session.commitTransaction();
    return res.status(200).json({ success: true, message: "Course updated successfully.", updatedCourse });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while updating the course." });
  }
  finally {
    session.endSession();
  }
};


// Get Courses List 
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({ status: "PUBLISHED" }, { courseName: true, price: true, thumbnail: true, instructor: true, ratingAndReviews: true, studentsEnrolled: true, }).populate("instructor");
    return res.status(200).json({ success: true, allCourses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while fetching courses." });
  }
};


// Get Course Details 
exports.getCourseDetails = async (req, res) => {
  try {
    const _id = req.params.courseId;
    const courseDetails = await Course.findOne({ _id }).populate({
      path: "instructor",
      populate: { path: "additionalDetails" },
    }).populate("category").populate("ratingAndReviews").populate({
      path: "courseContent",
      populate: {
        path: "subSections",
      },
    });

    if (!courseDetails) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    // Calculate total duration of the course
    let totalDurationInSeconds = 0;
    courseDetails?.courseContent?.forEach((content) => {
      content?.subSections?.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);
    courseDetails.totalDuration = totalDuration;

    return res.status(200).json({ success: true, courseDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while fetching course details." });
  }
};


// Get Course Content 
exports.getCourseContent = async (req, res) => {
  try {
    const _id = req.params.courseId;
    const userId = req.user.id;
    const courseDetails = await Course.findOne({ _id }).populate({
      path: "instructor",
      populate: { path: "additionalDetails" },
    }).populate("category").populate("ratingAndReviews").populate({
      path: "courseContent",
      populate: { path: "subSection" },
    });

    if (!courseDetails) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    // Calculate total duration of the course
    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    // Get course progress for the user
    const courseProgressCount = await CourseProgress.findOne({
      courseID: _id,
      userId: userId,
    });

    return res.status(200).json({
      success: true,
      courseDetails: {
        ...courseDetails.toObject(),
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos || [],
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while fetching course content." });
  }
};


// Get all courses of a given instructor 
exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user._id;
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, instructorCourses });
  } catch (error) { console.error(error); return res.status(500).json({ success: false, message: "An error occurred while fetching courses." }); }
};

// Delete Course
exports.deleteCourse = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const _id = req.params.courseId;

    const course = await Course.findById(_id).session(session);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    // Check if the user is authorized to delete the course
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access." });
    }

    // Un-enroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: _id },
      }, { session });
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId).session(session);
      if (section) {
        const subSections = section.subSections;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId).session(session);
        }
      }
      // Delete the section
      await Section.findByIdAndDelete(sectionId).session(session);
    }

    // Delete the course
    await Course.findByIdAndDelete(_id).session(session);

    await session.commitTransaction();
    return res.status(200).json({ success: true, message: "Course deleted successfully." });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while deleting the course." });
  } finally {
    session.endSession();
  }
};