import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const schema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please enter name"],
  },
  email: {
    type: String,
    required: [true, "Please enter e-mail"],
    unique: [true, "E-mail already exists, try logging in!"],
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "Please enter password!"],
    minlength: [6, "Password must be atleast six characters long!!!"],
    select: false,
  },
  phoneNumber: {
    type: Number,
    required: [true, "Please enter the phone number!"],
    unique: [true, "Phone number already associated with an account"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  character: {
    public_id: String,
    url: String,
  },
  otp: Number,
  otp_expire: Date,
});

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

schema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

schema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

export const User = mongoose.model("User", schema);
