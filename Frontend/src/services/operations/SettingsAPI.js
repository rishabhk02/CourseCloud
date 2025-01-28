import { toast } from "react-hot-toast";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { settingsEndpoints } from "../apis";
import { logout } from "./authAPI";

const { UPDATE_PROFILE_IMAGE, UPDATE_PROFILE_API, CHANGE_PASSWORD_API, DELETE_PROFILE_API } = settingsEndpoints;

export function updateProfileImage(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_IMAGE, formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      )
      if (response.status !== 200) {
        throw new Error(response.data.message);
      }
      toast.success("Profile image updated successfully!");
      dispatch(setUser(response.data.updatedProfile));
    } catch (error) {
      console.error("UPDATE_PROFILE_IMAGE API ERROR............", error);
      toast.error("Failed to update profile image. Please try again!");
    } finally {
      toast.dismiss(toastId);
    }
  }
}

export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      })

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      const profileImage = response.data.updatedUserDetails.profileImage
        ? response.data.updatedUserDetails.profileImage
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`

      dispatch(setUser({ ...response.data.updatedUserDetails, profileImage }));
      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.error("UPDATE_PROFILE_API API ERROR............", error)
      toast.error("Failed to update profile. Please try again!");
    } finally {
      toast.dismiss(toastId);
    }
  }
}

export async function changePassword(token, formData) {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Password changed successfully.");
  } catch (error) {
    console.error("CHANGE_PASSWORD_API API ERROR............", error);
    toast.error(error.response.data.message);
  } finally {
    toast.dismiss(toastId);
  }
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      })
      

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Profile Deleted Successfully")
      dispatch(logout(navigate))
    } catch (error) {
      console.error("DELETE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Delete Profile")
    }
    toast.dismiss(toastId)
  }
}