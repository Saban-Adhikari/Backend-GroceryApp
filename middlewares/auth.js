import { User } from "../models/userSchema.js";
import ErrorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";
import { asyncError } from "./error.js";

export const isAuthenticated = asyncError(async (req, res, next) => {
  //const token = req.cookies.token;

  const { token } = req.cookies;

  if (!token) return next(new ErrorHandler("Not logged in!", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData._id);

  next();
});

export const verifyAdmin = asyncError(async (req, res, next) => {
  if (req.user.role !== "admin")
    return next(new ErrorHandler("Only user admin shall access!", 401));
  next();
});
