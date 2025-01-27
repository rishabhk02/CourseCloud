import React, { useEffect, useState } from "react";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { FaShareSquare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BsFillCaretRightFill } from "react-icons/bs";
import { addToCart } from "../../../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { endpoints } from "../../../services/apis";
import { apiConnector } from "../../../services/apiConnector";
import { addCourseToCart } from "../../../services/operations/cartAPI";


function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const token = localStorage.getItem('token');
  const user = useSelector((state) => state.profile.user);

  async function checkIsLogin() {
    try {
      await apiConnector("GET", endpoints.TOKEN_VALIDATION_API, null, {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      });
      setIsLogin(true);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    checkIsLogin();
  }, []);

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to clipboard")
  }

  const handleAddToCart = () => {
    if (user && user?.userRole === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return;
    }
    if (isLogin) {
      addCourseToCart(course._id, token);
      dispatch(addToCart(course));
      return;
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  }

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}
      >
        {/* Course Image */}
        <img
          src={course?.thumbnail}
          alt={course?.courseName}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />

        <div className="px-4">
          <div className="space-x-3 pb-4 text-3xl font-semibold">
            Rs. {course?.price}
          </div>
          <div className="flex flex-col gap-4">
            <button
              className="yellowButton"
              onClick={
                user && course?.studentsEnrolled.includes(user?._id)
                  ? () => navigate("/dashboard/enrolled-courses")
                  : handleBuyCourse
              }
            >
              {user && course?.studentsEnrolled.includes(user?._id)
                ? "Go To Course"
                : "Buy Now"}
            </button>
            {(!user || !course?.studentsEnrolled.includes(user?._id)) && (
              <button onClick={handleAddToCart} className="blackButton">
                Add to Cart
              </button>
            )}
          </div>
          <div>
            <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
              30-Day Money-Back Guarantee
            </p>
          </div>

          <div className={``}>
            <p className={`my-2 text-xl font-semibold `}>
              This Course Includes :
            </p>
            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
              {course?.instructions?.map((item, i) => {
                return (
                  <p className={`flex gap-2`} key={i}>
                    <BsFillCaretRightFill />
                    <span>{item}</span>
                  </p>
                )
              })}
            </div>
          </div>
          <div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> Share
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseDetailsCard;
