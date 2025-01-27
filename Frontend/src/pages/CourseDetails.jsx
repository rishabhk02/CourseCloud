import React, { useEffect, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import ConfirmationModal from "../components/Common/ConfirmationModal"
import Footer from "../components/Common/Footer"
import RatingStars from "../components/Common/RatingStars"
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar"
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard"
import { formatDate } from "../services/formatDate"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import { BuyCourse } from "../services/operations/studentFeaturesAPI"
import GetAvgRating from "../utils/avgRating"
import Error from "./Error"
import Navbar from "../components/Common/Navbar"

function CourseDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const token = localStorage.getItem('token');
  const [isActive, setIsActive] = useState(Array(0));
  const [courseDetail, setCourseDetail] = useState(null);
  const { user } = useSelector((state) => state.profile);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const { paymentLoading } = useSelector((state) => state.course);
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  const [confirmationModal, setConfirmationModal] = useState(null);

  console.log('Rj', courseId);

  const getCourseDetail = async () => {
    try {
      const res = await fetchCourseDetails(courseId);
      setCourseDetail(res);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!courseId) return;
    getCourseDetail();
  }, [courseId]);

  useEffect(() => {
    const count = GetAvgRating(courseDetail?.ratingAndReviews);
    setAvgReviewCount(count);
  }, [courseDetail]);

  const handleActive = (id) => {
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e != id)
    )
  }

  useEffect(() => {
    let lectures = 0
    courseDetail?.data?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec.subSections.length || 0
    })
    setTotalNoOfLectures(lectures);
  }, [courseDetail]);

  // if (loading || !courseDetail) {
  //   return (
  //     <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
  //       <div className="spinner"></div>
  //     </div>
  //   )
  // }
  // if (!courseDetail.success) {
  //   return <Error />
  // }

  const handleBuyCourse = () => {
    if (token) {
      BuyCourse(token, [courseId], user, navigate, dispatch)
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  if (paymentLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="relative w-full bg-richblack-800">
        {/* Hero Section */}
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            {/* Course Details Section */}
            <div
              className="z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5"
            >
              <div>
                <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                  {courseDetail?.courseName || "Course Name"}
                </p>
              </div>
              <p className="text-richblack-200">
                {courseDetail?.courseDescription || "No description available"}
              </p>
              <div className="text-md flex flex-wrap items-center gap-2">
                <span className="text-yellow-25">{avgReviewCount || 0}</span>
                <RatingStars Review_Count={avgReviewCount || 0} Star_Size={24} />
                <span>{`(${courseDetail?.ratingAndReviews?.length || 0} reviews)`}</span>
                <span>{`${courseDetail?.studentsEnrolled?.length || 0} Students enrolled`}</span>
              </div>
              <div>
                <p>
                  Created By{" "}
                  {`${courseDetail?.instructor?.firstName || "Instructor"} ${courseDetail?.instructor?.lastName || ""
                    }`}
                </p>
              </div>
              <div className="flex flex-wrap gap-5 text-lg">
                <p className="flex items-center gap-2">
                  <BiInfoCircle /> Created at{" "}
                  {formatDate(courseDetail?.createdAt) || "Unknown"}
                </p>
                <p className="flex items-center gap-2">
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>
          </div>

          {/* Courses Card */}
          <div className="absolute right-[1rem] top-[60px] hidden min-h-[600px] w-1/3 max-w-[410px] lg:block">
            <CourseDetailsCard
              course={courseDetail}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
      </div>


      <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
          {/* What will you learn section */}
          <div className="my-8 border border-richblack-600 p-8">
            <p className="text-3xl font-semibold">What you'll learn</p>
            <div className="mt-5">
              <ReactMarkdown>{courseDetail?.whatYouWillLearn}</ReactMarkdown>
            </div>
          </div>

          {/* Course Content Section */}
          <div className="max-w-[830px] ">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-semibold">Course Content</p>
              <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2">
                  <span>
                    {courseDetail?.courseContent?.length} {`Section(s)`}
                  </span>
                  <span>
                    {totalNoOfLectures} {`Lecture(s)`}
                  </span>
                  <span>{courseDetail?.duration}(hrs) total length</span>
                </div>
                <div>
                  <button
                    className="text-yellow-25"
                    onClick={() => setIsActive([])}
                  >
                    Collapse all sections
                  </button>
                </div>
              </div>
            </div>

            {/* Course Details Accordion */}
            <div className="py-4">
              {courseDetail?.courseContent?.map((course, index) => (
                <CourseAccordionBar
                  course={course}
                  key={index}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>

            {/* Author Details */}
            <div className="mb-12 py-4">
              <p className="text-[28px] font-semibold">Author</p>
              <div className="flex items-center gap-4 py-4">
                <img
                  src={
                    courseDetail?.instructor?.profileImage
                      ? courseDetail?.instructor?.profileImage
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${courseDetail?.instructor.firstName} ${courseDetail?.instructor.lastName}`
                  }
                  alt="Author"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <p className="text-lg">{`${courseDetail?.instructor.firstName} ${courseDetail?.instructor.lastName}`}</p>
              </div>
              <p className="text-richblack-50">
                {courseDetail?.instructor?.additionalDetails?.about}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default CourseDetails
