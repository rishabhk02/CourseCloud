const mongoose = require('mongoose');
const Category = require("../models/Category");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Add new category
exports.createCategory = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { categoryName, description } = req.body;
    if (!categoryName) {
      return res.status(400).json({ success: false, message: "Category name is required." });
    }
    await Category.create([{ categoryName, description }], { session });
    await session.commitTransaction();
    return res.status(201).json({ success: true, message: "Course category added successfully." });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while adding the category. Please try again." });
  } finally {
    session.endSession();
  }
}

// Get all categories
exports.showAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ success: true, message: "Categories fetched successfully.", categories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while fetching categories. Please try again." });
  }
}

// Get category page metrics
exports.categoryPageDetails = async (req, res) => {
  try {
    const _id = req.params.categoryId;
    if (!_id) {
      return res.status(400).json({ success: false, message: "Please provide a valid category ID." });
    }

    // Courses for the given category
    const selectedCategoryCourses = await Category.findById(_id).populate({
      path: "courses",
      match: { status: "PUBLISHED" },
      populate: "ratingAndReviews",
    });

    if (!selectedCategoryCourses) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    // Courses for other categories
    const otherCategories = await Category.find({ _id: { $ne: _id } });
    let otherCategoryCourses = await Category.findOne({
      _id: otherCategories[getRandomInt(otherCategories.length)]._id,
    }).populate({
      path: "courses",
      match: { status: "PUBLISHED" },
      populate: "ratingAndReviews",
    });

    // Most selling courses aggregation
    const mostSellingCourses = await Category.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "courses",
          foreignField: "_id",
          as: "courses",
        },
      },
      {
        $unwind: "$courses",
      },
      {
        $match: {
          "courses.status": "PUBLISHED",
        },
      },
      {
        $addFields: {
          enrolledCount: { $size: "$courses.studentsEnrolled" }, // Add a field for the length of `studentsEnrolled`
        },
      },
      {
        $sort: {
          enrolledCount: -1, // Sort by the length of `studentsEnrolled` in descending order
        },
      },
      {
        $limit: 10, // Limit the result to the top 10 courses
      },
      {
        $replaceRoot: {
          newRoot: "$courses", // Replace the root with the `courses` object
        },
      },
    ]);
    

    return res.status(200).json({ success: true, message: "Category details fetched successfully.", selectedCategoryCourses, otherCategoryCourses, mostSellingCourses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while fetching category details. Please try again." });
  }
}
