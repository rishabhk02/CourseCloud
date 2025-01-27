import { useDispatch, useSelector } from "react-redux";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";
import { useEffect, useState } from "react";
import { getCartDetails } from "../../../../services/operations/cartAPI";
import { addToCart, initializeCart } from "../../../../slices/cartSlice";


export default function Cart() {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const courses = useSelector((state) => state.cart.cart)
  const { paymentLoading } = useSelector((state) => state.course)

  const [cart, setCart] = useState(null);
  const fetchCartData = async() => {
    try {
      const response = await getCartDetails(token);
      if(response){
        dispatch(initializeCart(response));
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(()=>{
    fetchCartData();
  },[]);

  if (paymentLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="spinner"></div>
      </div>
    )

  return (
    <>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">Cart</h1>
      <p className="border-b border-b-richblack-400 pb-2 font-semibold text-richblack-400">
        {courses.length} Courses in Cart
      </p>
      {courses.length > 0 ? (
        <div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
          <RenderCartCourses />
          <RenderTotalAmount />
        </div>
      ) : (
        <p className="mt-14 text-center text-3xl text-richblack-100">
          Your cart is empty
        </p>
      )}
    </>
  )
}
