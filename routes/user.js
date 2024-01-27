import express from "express";
import {
  forgotPassword,
  getMyProfile,
  login,
  logOut,
  passwordUpdate,
  profileUpdate,
  resetPassword,
  signup,
  updatePicture,
} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

// Create a router
const router = express.Router();

// Create routes
router.post("/login", login);

//creating new user routes
router.post("/new", singleUpload, signup);

//getting a users profile
router.get("/me", isAuthenticated, getMyProfile);

//logging out
router.get("/logout", isAuthenticated, logOut);

//updating routes
router.put("/updateprofile", isAuthenticated, profileUpdate);

router.put("/updatepassword", isAuthenticated, passwordUpdate);

router.put("/updatepic", isAuthenticated, singleUpload, updatePicture);

//If forgot password and to reset password
router.route("/forgotpassword").post(forgotPassword).put(resetPassword);

export default router;
