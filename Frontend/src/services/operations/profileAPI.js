import { toast } from "react-hot-toast"

import { setLoading, setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { profileEndpoints } from "../apis"
import { logout } from "./authAPI"

const {
  GET_USER_DETAILS_API,
  GET_ENROLLED_COURSES_API,
  GET_INSTRUCTOR_DATA_API,
} = profileEndpoints



// export function getUserDetails(token, navigate) {
//   return async (dispatch) => {
//    
//     const toastId = toast.loading("Loading...");
//     dispatch(setLoading(true));
//     try {
//       const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
//         Authorization: `Bearer ${token}`,
//       })
//       

//       if (!response.data.success) {
//         throw new Error(response.data.message)
//       }
//       const userImage = response.data.data.image
//         ? response.data.data.image
//         : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
//       dispatch(setUser({ ...response.data.data, image: userImage }))
//     } catch (error) {
//       dispatch(logout(navigate))
//     
//       toast.error("Could Not Get User Details")
//     }finally{
//       toast.dismiss(toastId)
//       dispatch(setLoading(false))

//     }
//   }
// }

export function getUserDetails(token, navigate) {
  return async (dispatch, getState) => {
    const { profile } = getState();
    const currentUser = profile.user;

    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      let userData = response.data.userDetails;
      userData.profileImage = userData.profileImage || `https://api.dicebear.com/5.x/initials/svg?seed=${userData.firstName} ${userData.lastName}`;


      if (JSON.stringify(currentUser) !== JSON.stringify(userData)) {
        dispatch(setUser({ ...userData }));
      }
    } catch (error) {
      dispatch(logout(navigate));
    }
  };
}



export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response?.data?.courses;
  } catch (error) {
    console.error("GET_INSTRUCTOR_DATA_API API ERROR............", error)
    toast.error("Could Not Get Instructor Data")
  } finally {
    toast.dismiss(toastId);
  }
}
