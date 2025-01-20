const BASE_URL = process.env.REACT_APP_BE_URL;
console.log(BASE_URL);

// AUTH ENDPOINTS
export const endpoints = {
  SEND_EMAIL_VERIFICATION_OTP_API: `${BASE_URL}/auth/sendEmailVerificationOtp`,
  SIGNUP_API: `${BASE_URL}/auth/register`,
  LOGIN_API: `${BASE_URL}/auth/login`,
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  TOKEN_VALIDATION_API: `${BASE_URL}/auth/checkIsTokenValid`
}

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserAllDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: `${BASE_URL}/profile/instructorDashboard`,
}

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
}

// COURSE ENDPOINTS
export const courseEndpoints = {
  CREATE_COURSE_API: `${BASE_URL}/course/createCourse`,
  CREATE_SECTION_API: `${BASE_URL}/section/addSection`,
  GET_INSTRUCTOR_COURSES_API: `${BASE_URL}/course/getInstructorCourses`,
  DELETE_COURSE_API: `${BASE_URL}/course/deleteCourse`,
  CREATE_SUBSECTION_API: `${BASE_URL}/subsection/addSubSection`,
  EDIT_COURSE_API: `${BASE_URL}/course/editCourse`,
  DELETE_SECTION_API: `${BASE_URL}/section/deleteSection`,
  DELETE_SUBSECTION_API: `${BASE_URL}/subsection/deleteSubSection`,
  GET_COURSE_DETAILS: `${BASE_URL}/course/getCourseDetails`,
  UPDATE_SECTION_API: `${BASE_URL}/section/updateSection`,
  UPDATE_SUBSECTION_API: `${BASE_URL}/subsection/updateSubSection`,
  COURSE_DETAILS_API: `${BASE_URL}/course/getCourseDetails`,


  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
}

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
}

// CATAGORIES API
export const categories = {
  GET_ALL_CATEGORIES_API: `${BASE_URL}/category/showAllCategories`,
}

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: `${BASE_URL}/category/getCategoryPageDetails`,
}

// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/contact/submitForm",
}


// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_PROFILE_IMAGE: `${BASE_URL}/profile/updateProfileImage`,
  UPDATE_PROFILE_API: `${BASE_URL}/profile/updateProfileDetail`,
  CHANGE_PASSWORD_API: `${BASE_URL}/auth/changePassword`,
  DELETE_PROFILE_API: `${BASE_URL}/profile/deleteProfile`,
}
