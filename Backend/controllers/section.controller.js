const mongoose = require("mongoose");
const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/Subsection");

// Create Course Section
exports.createSection = async (req, res) => {
  try {
    const { courseId, sectionName, sectionDesc } = req.body;

    // Required field validation
    if (!courseId || !sectionName) {
      return res.status(400).json({ success: false, message: "Mandatory fields are required." });
    }

    // Checking if user is allowed to create section
    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).json({ success: false, message: "Invalid course id." });
    }
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }

    const newSection = await Section.create({ courseId, sectionName, sectionDesc });

    // Add section to course content
    let updatedCourse = null;
    try {
      updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        {
          $push: {
            courseContent: newSection._id,
          },
        },
        { new: true }
      ).populate({
        path: "courseContent",
        populate: {
          path: "subSections",
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }

    return res.status(201).json({ success: true, message: "Section created successfully.", updatedCourse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occured while creating section." });
  }
}

// Update a section
exports.updateSection = async (req, res) => {
  try {
    const { courseId, sectionId, sectionName, sectionDesc } = req.body;
    let course = await Course.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Invalid course id.' });
    }
    if (course.instructor != req.user._id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }

    await Section.findByIdAndUpdate(sectionId, { sectionName, sectionDesc }, { new: true });
    course = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subSections",
      },
    });

    return res.status(200).json({ success: true, message: "Section detail updated successfully.", course });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occured while updating section.", error: error.message });
  }
}

// Delete a section
exports.deleteSection = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { courseId, sectionId } = req.params;

    // Find the course
    let course = await Course.findOne({ _id: courseId }).session(session);
    if (!course) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Invalid course id." });
    }

    // Check instructor authorization
    if (course.instructor.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ success: false, message: "Unauthorized access." });
    }

    // Remove the section ID from the course content
    await Course.findByIdAndUpdate(
      courseId,
      { $pull: { courseContent: sectionId } },
      { new: true, session }
    );

    // Find the section
    const section = await Section.findById(sectionId).session(session);
    if (!section) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Section not found." });
    }

    // Delete associated subsections
    await SubSection.deleteMany({ _id: { $in: section.subSection } }).session(session);

    // Delete the section
    await Section.findByIdAndDelete(sectionId).session(session);

    // Populate the updated course content
    course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSections",
        },
      })
      .session(session);

    // Commit the transaction
    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully.",
      course,
    });
  } catch (error) {
    // Rollback the transaction in case of an error
    await session.abortTransaction();
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while deleting the section.", });
  } finally {
    session.endSession();
  }
};
