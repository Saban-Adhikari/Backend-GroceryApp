import { asyncError } from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../utils/error.js";
import {
  cookieOptions,
  getDataUri,
  sendEmail,
  sendToken,
} from "../utils/features.js";
import cloudinary from "cloudinary";

// for login
export const login = asyncError(async (req, res, next) => {
  //Getting email and password from request body
  const { email, password } = req.body;

  //Checking if user exists
  const user = await User.findOne({ email }).select("+password");

  //Handling error
  if (!user) {
    return next(new ErrorHandler("Incorrect email or password", 400));
  }

  //Handling error
  if (!password)
    return next(new ErrorHandler("Please enter the password!", 400));

  //Handling error
  const isMatched = await user.comparePassword(password);

  if (!isMatched) {
    return next(new ErrorHandler("Incorrect email or password", 400));
  }

  sendToken(user, res, `Wohoo, hi, ${user.fullName}`, 200);
});

// for signup
export const signup = asyncError(async (req, res, next) => {
  const { fullName, email, password, phoneNumber } = req.body;

  //Checking if user already exists
  let user = await User.findOne({ email });

  //Handling error
  if (user) return next(new ErrorHandler("User already exists!", 400));

  let character = undefined;

  //Uploading image to cloudinary
  if (req.file) {
    const file = getDataUri(req.file);

    const result = await cloudinary.v2.uploader.upload(file.content);

    character = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  //Creating new user
  user = await User.create({
    fullName,
    email,
    password,
    phoneNumber,
    character,
  });
  //Sending token
  sendToken(user, res, `Registered successfully!`, 201);
});

// for logout
export const logOut = asyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      ...cookieOptions,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "You have logged out!",
    });
});

//for get my profile
export const getMyProfile = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

//for profile update
export const profileUpdate = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const { fullName, email, phoneNumber } = req.body;

  if (fullName) user.fullName = fullName;
  if (email) user.email = email;
  if (phoneNumber) user.phoneNumber = phoneNumber;

  await user.save();

  res.status(200).json({
    success: true,
    message: "user profile has beeen updated successfully!",
  });
});

//for password update
export const passwordUpdate = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+ password");

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return next(
      new ErrorHandler(
        "Please enter the old password and the new password!",
        400
      )
    );

  const isMatched = await user.comparePassword(oldPassword);

  if (!isMatched)
    return next(new ErrorHandler("Incorrect old password!!!", 400));

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Your password has been changed!",
  });
});

//for update picture
export const updatePicture = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const file = getDataUri(req.file);

  await cloudinary.v2.uploader.destroy(user.character.public_id);

  const result = await cloudinary.v2.uploader.upload(file.content);
  user.character = {
    public_id: result.public_id,
    url: result.secure_url,
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Picture updated successfully!",
  });
});

//for forgot password
export const forgotPassword = asyncError(async (req, res, next) => {
  const { email } = req.body; //getting email from request body
  const user = await User.findOne({ email }); //finding user with that email

  if (!user)
    return next(
      new ErrorHandler("User with that e-mail does not exist!!!", 404)
    );

  const randomNum = Math.random() * (999999 - 100000) + 100000; //generating random 6 digit number

  const otp = Math.floor(randomNum); //converting to integer

  const otp_expire = 15 * 60 * 1000; //15 minutes expiry time for otp

  user.otp = otp;
  user.otp_expire = new Date(Date.now() + otp_expire);
  await user.save();

  const message = `OTP for changing password is ${otp}. Please ignore if you didn't request this!`;

  try {
    await sendEmail("OTP for password reset", user.email, message);
  } catch (error) {
    user.otp = null;
    user.otp_expire = null;
    await user.save();
    return next(error);
  }

  res.status(200).json({
    success: true,
    message: `Success sending e-mail to ${user.email}!`,
  });
});

//for reset password
export const resetPassword = asyncError(async (req, res, next) => {
  const { otp, password } = req.body;

  const user = await User.findOne({
    otp,
    otp_expire: {
      $gt: Date.now(),
    },
  });

  if (!user)
    return next(
      new ErrorHandler("Otp entered is incorrect or expired!!!", 400)
    );

  if (!password)
    return next(new ErrorHandler("Please enter the new password", 400));
  user.password = password;
  user.otp = undefined;
  user.otp_expire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "You have changed the password!",
  });
});
