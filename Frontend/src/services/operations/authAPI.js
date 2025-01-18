import { endpoints } from "../apis";
import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { resetCart } from "../../slices/cartSlice";
import { setUser } from "../../slices/profileSlice";
import { setLoading } from "../../slices/authSlice";

const { SEND_EMAIL_VERIFICATION_OTP_API, SIGNUP_API, LOGIN_API, RESETPASSTOKEN_API, RESETPASSWORD_API } = endpoints;


export function sendOtp(email, navigate) {
  // Redux - thunk
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SEND_EMAIL_VERIFICATION_OTP_API, { email, checkUserPresent: true });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent Successfully.");
      navigate("/verify-email");
    } catch (error) {
      console.error("SEND-OTP API ERROR............", error);
      toast.error("Failed to send otp! Please try again.");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  }
}

export function signUp(userRole, firstName, lastName, email, password, confirmPassword, otp, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, { userRole, firstName, lastName, email, password, confirmPassword, otp, });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Registration Successfull!");
      navigate("/login");
    } catch (error) {
      console.error("SIGNUP API ERROR............", error);
      toast.error("Signup Failed");
      navigate("/signup");
    }
    finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, { email, password });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successfull!");
      // dispatch(setToken(response.data.token));
      const profileImage = response.data.user.profileImage ||
        `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}&&backgroundColor=ffff00`;
      dispatch(setUser({ ...response.data.user, profileImage }));
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.error("LOGIN API ERROR............", error)
      toast.error("Login Failed")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      })

      console.log("RESETPASSTOKEN RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Reset Email Sent")
      setEmailSent(true)
    } catch (error) {
      console.log("RESETPASSTOKEN ERROR............", error)
      toast.error("Failed To Send Reset Email")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      })

      console.log("RESETPASSWORD RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Password Reset Successfully")
      navigate("/login")
    } catch (error) {
      console.log("RESETPASSWORD ERROR............", error)
      toast.error("Failed To Reset Password")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    navigate("/");
  }
}
