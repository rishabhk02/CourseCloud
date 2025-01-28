import { toast } from "react-hot-toast"

import { updateCompletedLectures } from "../../slices/viewCourseSlice"
// import { setLoading } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector"
import { courseEndpoints, categories } from "../apis"

const {
  GET_COURSE_DETAILS,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
  GET_ENROLLED_COURSES_API
} = courseEndpoints;

export const getAllCourses = async () => {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories")
    }
    result = response?.data?.data
  } catch (error) {
    console.error("GET_ALL_COURSE_API API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const fetchCourseDetails = async (courseId) => {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("GET", `${GET_COURSE_DETAILS}/${courseId}`);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.courseDetails;
  } catch (error) {
    console.error("GET_COURSE_DETAILS API ERROR............", error);
  } finally {
    toast.dismiss(toastId);
  }
}

// fetching the available course categories
export const fetchCourseCategories = async () => {
  try {
    const response = await apiConnector("GET", categories.GET_ALL_CATEGORIES_API);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }
    return response?.data?.categories;
  } catch (error) {
    console.error("COURSE_CATEGORY_API API ERROR............", error);
    toast.error(error.message);
  }
}

// add the course details
export const addCourseDetails = async (data, token) => {
  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error('Failed to add course.')
    }
    toast.success('Course added successfully!')
    return response?.data?.newCourse;
  } catch (error) {
    console.error("CREATE COURSE API ERROR............", error)
    toast.error(error.data.message)
  }
}

// edit the course details
export const editCourseDetails = async (courseId, data, token) => {
  try {
    const response = await apiConnector("PUT", `${EDIT_COURSE_API}/${courseId}`, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details");
    }
    toast.success("Course Details Updated Successfully");
    return response?.data?.updatedCourse;
  } catch (error) {
    console.error("EDIT COURSE API ERROR............", error)
    toast.error(error.message)
  }
}

// create a section
export const createSection = async (data, token) => {
  const toastId = toast.loading("Submitting the form...");
  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error(response.data.message)
    }
    toast.success('Section created successfully.');
    return response?.data?.updatedCourse;
  } catch (error) {
    // toast.error(error.data.message);
    console.error("CREATE SECTION API ERROR............", error)
  } finally {
    toast.dismiss(toastId);
  }
}

// create a subsection
export const createSubSection = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error('Could not add lecture');
    }
    toast.success("Lecture Added");
    return response?.data?.updatedSection;
  } catch (error) {
    console.error("CREATE SUB-SECTION API ERROR............", error);
    toast.error(error.message);
  } finally {
    toast.dismiss(toastId);
  }
}

// update a section
export const updateSection = async (data, token) => {
  const toastId = toast.loading("Submitting the form...");
  try {
    const response = await apiConnector("PUT", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Failed to updated section");
    }
    toast.success("Section updated successfully.");
    return response?.data?.course;
  } catch (error) {
    console.error("UPDATE SECTION API ERROR............", error);
    toast.error(error.message)
  } finally {
    toast.dismiss(toastId);
  }
}

// update a subsection
export const updateSubSection = async (data, token) => {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("PUT", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Failed to update lecture");
    }
    toast.success("Lecture updated successfully");
    return response?.data?.updatedSection;
  } catch (error) {
    toast.error(error.message);
    console.error("UPDATE SUB-SECTION API ERROR............", error)
  } finally {
    toast.dismiss(toastId);
  }
}

// delete a section
export const deleteSection = async (data, token) => {
  const toastId = toast.loading("Deleting the section...");
  try {
    const response = await apiConnector("DELETE", `${DELETE_SECTION_API}/${data.courseId}/${data.sectionId}`, null, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Failed to delete the section");
    }
    toast.success("Section deleted successfully.");
    return response?.data?.course;
  } catch (error) {
    console.error("DELETE SECTION API ERROR............", error);
    toast.error(error.message);
  } finally {
    toast.dismiss(toastId);
  }
}
// delete a subsection
export const deleteSubSection = async (data, token) => {
  const toastId = toast.loading("Deleting the lecture...");
  try {
    const response = await apiConnector("DELETE", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Failed to delete the lecture.");
    }
    toast.success("Lecture deleted successfully.")
    return response?.data?.updatedSection;
  } catch (error) {
    console.error("DELETE SUB-SECTION API ERROR............", error);
    toast.error(error.message)
  } finally {
    toast.dismiss(toastId);
  }
}

// fetching all courses under a specific instructor
export const fetchInstructorCourses = async (token) => {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_COURSES_API, null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses");
    }
    return response?.data?.instructorCourses;
  } catch (error) {
    console.error("INSTRUCTOR COURSES API ERROR............", error);
    toast.error(error.message);
  } finally {
    toast.dismiss(toastId);
  }
}

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...")

  let result = []
  try {
    const response = await apiConnector(
      "GET",
      GET_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
   

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.error("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
    toast.error("Could Not Get Enrolled Courses")
  }
  toast.dismiss(toastId)
  return result
}

// delete a course
export const deleteCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("DELETE", `${DELETE_COURSE_API}/${courseId}`, null, {
      Authorization: `Bearer ${token}`,
    })
    
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course")
    }
    toast.success("Course Deleted")
  } catch (error) {
    console.error("DELETE COURSE API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
}

// get full details of a course
export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("GET", `${GET_COURSE_DETAILS}/${courseId}`, null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response?.data?.courseDetails;
  } catch (error) {
    console.error("COURSE_FULL_DETAILS_API API ERROR............", error);
    toast.error(error.message);
  } finally {
    toast.dismiss(toastId);
  }
}

// mark a lecture as complete
export const markLectureAsComplete = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.message) {
      throw new Error(response.data.error)
    }
    toast.success("Lecture Completed")
    result = true
  } catch (error) {
    console.error("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error)
    toast.error(error.message)
    result = false
  }
  toast.dismiss(toastId)
  return result
}

// create a rating for course
export const createRating = async (data, token) => {
  const toastId = toast.loading("Loading...")
  let success = false
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    })
   
    if (!response?.data?.success) {
      throw new Error("Could Not Create Rating")
    }
    toast.success("Rating Created")
    success = true
  } catch (error) {
    success = false
    console.error("CREATE RATING API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return success
}
