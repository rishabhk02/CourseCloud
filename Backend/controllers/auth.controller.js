const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTP = require("../models/OTP");
const User = require("../models/User");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const passwordUpdateEmailTemplate = require("../mail/templates/passwordUpdateConfirmation");
const mongoose = require("mongoose");

// User Registration
exports.register = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Receiving all the fields from the body
    const { firstName, lastName, email, password, confirmPassword, userRole, otp } = req.body;

    // Mandatory fields validation
    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(400).json({ success: false, message: "All mandatory fields are required." });
    }

    // Password matching
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match! Please try again." });
    }

    // Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists! Please sign in to continue." });
    }

    // Most recent OTP for email verification
    const otpArr = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

    // OTP validation
    if (otpArr.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    } else if (otp !== otpArr[0].otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    // Password Hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create([{
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userRole: userRole,
      additionalDetails: profile[0]._id,
      profileImage: `${process.env.IMAGE_GENERATOR_API}${firstName} ${lastName}`,
    }], { session });

    // User profile creation
    const profile = await Profile.create([{
      userId: newUser._id,
      gender: null,
      dateOfBirth: null,
      about: null,
      mobileNumber: null,
    }], { session });

    await session.commitTransaction();

    newUser[0].password = undefined;

    return res.status(201).json({ success: true, message: "User registered successfully.", newUser: newUser[0] });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    return res.status(500).json({ success: false, message: "User registration failed! Please try again." });
  } finally {
    session.endSession();
  }
}

// Login Controller
exports.login = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Find user with provided email
    const user = await User.findOne({ email }).populate("additionalDetails");

    // If user not found with provided email
    if (!user) {
      return res.status(401).json({ success: false, message: "User is not registered with us! Please signup to continue." });
    }

    // Generate JWT token and compare password
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email, _id: user._id, role: user.userRole }, process.env.JWT_SECRETE_KEY, { expiresIn: "24h" });

      // Add token to user document and remove password
      user.token = token;
      user.password = undefined;

      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.cookie("token", token, options).status(200).json({ success: true, token, user, message: "Login successful." });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials! Please enter valid email and password." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Login failed! Please try again." });
  }
}

// Send OTP For Email Verification
exports.sendEmailVerificationOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Existing user validation
    const isExists = await User.findOne({ email });

    // If user found with provided email
    if (isExists) {
      return res.status(409).json({ success: false, message: "Email already registered! Please login to continue." });
    }

    // Generate OTP
    var otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

    const otpPayload = { email, otp };
    await OTP.create(otpPayload);

    return res.status(200).json({ success: true, message: "OTP sent successfully to your registered email." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to send OTP! Please try again." });
  }
}

// Change Password
exports.changePassword = async (req, res) => {
  try {
    // Get user data from database
    let userDetails = await User.findById(req.user._id);

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: "Incorrect old password! Please enter the valid old password." });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    userDetails = await User.findByIdAndUpdate(req.user._id, { password: hashedPassword }, { new: true });

    if (!userDetails) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Send email notification
    try {
      const emailResponse = await mailSender(userDetails.email, "Password for your account has been updated.", passwordUpdateEmailTemplate(userDetails.email, `Password updated successfully for ${userDetails.firstName} ${userDetails.lastName}.`));
    } catch (error) {
      console.error("Error while sending password change email: ", error);
    }

    return res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while updating the password! Please try again." });
  }
}

// Send reset password mail
exports.resetPasswordToken = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const email = req.body.email;

    // Check if user exists or not
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email is not registered with us. Please enter a valid email." });
    }

    // Generate unique token to identify the user
    const token = crypto.randomBytes(20).toString("hex") + user._id;

    // Add token to user detail
    await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 600000, // Valid for 10 minutes
      },
      { session, new: true }
    );

    const passwordResetURL = `${process.env.PASSWORD_RESET_URL}${token}`;

    // Sending mail to reset the password
    await mailSender(
      email,
      "Password Reset",
      `Your link for password reset is ${passwordResetURL}. Please click this URL to reset your password. The link is valid for 10 minutes.`
    );

    await session.commitTransaction();

    return res.status(200).json({ success: true, message: "Email sent successfully! Please check your mail to continue further." });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while sending the reset password email! Please try again." });
  } finally {
    session.endSession();
  }
}

// Resetting the password
exports.resetPassword = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { password, confirmPassword, token } = req.body;

    // Check if passwords are matching
    if (confirmPassword !== password) {
      return res.status(400).json({ success: false, message: "Passwords do not match." });
    }

    const userDetails = await User.findOne({ token: token });
    if (!userDetails || !(userDetails.resetPasswordExpires > Date.now())) {
      return res.status(403).json({ success: false, message: "Invalid or expired token! Please regenerate your token." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate({ token: token }, { password: hashedPassword, token: null, resetPasswordExpires: null }, { session, new: true });

    await session.commitTransaction();

    return res.status(200).json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while resetting the password! Please try again." });
  } finally {
    session.endSession();
  }
}

// Checking if token is not expired and valid for protected routes
exports.checkIsTokenValid = (req, res) => {
  try {
    return res.status(200).json({ success: true, message: 'Token is valid.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error.' });
  }
}