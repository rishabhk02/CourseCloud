const SubSection = require("../models/Subsection");
const CourseProgress = require("../models/CourseProgress");

// Function to update course progress
exports.updateCourseProgress = async (req, res) => {
  try {
    const { courseId, subsectionId } = req.params;
    const userId = req.user._id;

    // Check if the subsection is valid
    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) {
      return res.status(404).json({ success: false, message: "Subsection not found" });
    }

    // Check if course progress exists for the user
    let courseProgress = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      // Create a new course progress document if it doesn't exist
      courseProgress = new CourseProgress({
        courseId: courseId,
        userId: userId,
        completedVideos: [subsectionId],
      });
    } else {
      // Update the existing course progress document
      // Add the subsection to the completedVideos array if it's not already included
      if (!courseProgress.completedVideos.includes(subsectionId)) {
        courseProgress.completedVideos.push(subsectionId);
      } else {
        return res.status(400).json({ success: false, message: "Subsection already completed" });
      }
    }

    // Save the updated or new course progress
    await courseProgress.save();

    return res.status(200).json({ success: true, message: "Course progress updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
