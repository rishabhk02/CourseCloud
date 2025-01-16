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
    const course = Course.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).json({ success: false, message: "Invalid course id." });
    }
    if (course.instructor != req.user._id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }

    const newSection = await Section.create({ courseId, sectionName, sectionDesc });

    // Add section to course content
    const updatedCourse = await Course.findByIdAndUpdate(
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
        path: "subSection",
      },
    });

    return res.status(200).json({ success: true, message: "Section created successfully.", updatedCourse });
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
        path: "subSection",
      },
    });

    return res.status(200).json({ success: true, message: "Section detail updated successfully.", course, });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occured while updating section.", error: error.message });
  }
}

// Delete a section
exports.deleteSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.body;
    let course = await Course.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Invalid course id.' });
    }
    if (course.instructor != req.user.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }

    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    })

    const section = await Section.findById(sectionId)
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found." });
    }

    // Delete the associated subsections
    await SubSection.deleteMany({ _id: { $in: section.subSection } })

    await Section.findByIdAndDelete(sectionId)

    course = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    });

    return res.status(200).json({ success: true, message: "Section deleted successfully.", course });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occured while deleting section" });
  }
}
