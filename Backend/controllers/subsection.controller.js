const mongoose = require('mongoose');
const Course = require('../models/Course');
const Section = require("../models/Section");
const SubSection = require("../models/Subsection");
const uploadImageToCloudinary = require("../utils/imageUploader");

// Create Sub-section
exports.createSubSection = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { courseId, sectionId, title, description } = req.body;
    const video = req.files.video;

    // Required field validation 
    if (!courseId || !sectionId || !title || !description || !video) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "All Fields are Required." });
    }

    // Upload the video file to cloudinary
    const uploadDetails = await uploadImageToCloudinary(video, process.env.IMAGE_FOLDER_NAME);

    // Create a new sub-section with the necessary information
    const SubSectionDetails = await SubSection.create([{
      courseId,
      sectionId,
      title,
      timeDuration: `${uploadDetails.duration}`,
      description,
      videoUrl: uploadDetails.secure_url,
    }], { session });

    // Update the corresponding section with the newly created sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSections: SubSectionDetails[0]._id } },
      { new: true }
    ).populate("subSections").session(session);

    await session.commitTransaction();

    return res.status(201).json({ success: true, message: "Sub-section created successfully.", updatedSection });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    return res.status(500).json({ success: false, message: "Failed to create sub-section." });
  } finally {
    session.endSession();
  }
};

// Update sub-section
exports.updateSubSection = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { courseId, sectionId, subSectionId, title, description } = req.body;
    const subSection = await SubSection.findById(subSectionId).session(session);

    // Validate course
    let course = await Course.findOne({ _id: courseId }).session(session);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Invalid course id.' });
    }
    if (course.instructor != req.user._id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }

    if (!subSection) {
      return res.status(404).json({ success: false, message: "Sub-section not found." });
    }

    if (title) subSection.title = title;
    if (description) subSection.description = description;

    if (req.files && req.files.video) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(video, process.env.IMAGE_FOLDER_NAME);
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save({ session });

    const updatedSection = await Section.findById(sectionId).populate("subSections").session(session);

    await session.commitTransaction();

    return res.status(200).json({ success: true, message: "Sub-section updated successfully.", updatedSection });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while updating the sub-section." });
  } finally {
    session.endSession();
  }
};

// Delete sub-section
exports.deleteSubSection = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { courseId, subSectionId, sectionId } = req.body;

    // Validate course
    let course = await Course.findOne({ _id: courseId }).session(session);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Invalid course id.' });
    }
    if (course.instructor != req.user._id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }

    // Updating section
    await Section.findByIdAndUpdate(
      sectionId,
      { $pull: { subSection: subSectionId } },
      { session }
    );

    const subSection = await SubSection.findByIdAndDelete(subSectionId).session(session);
    if (!subSection) {
      return res.status(404).json({ success: false, message: "Sub-section not found." });
    }

    // Find and return the updated section
    const updatedSection = await Section.findById(sectionId).populate("subSections").session(session);

    await session.commitTransaction();

    return res.status(200).json({ success: true, message: "Sub-section deleted successfully.", updatedSection });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while deleting the sub-section." });
  } finally {
    session.endSession();
  }
};
