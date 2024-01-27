import mongoose from "mongoose"; // Importing mongoose
import validator from "validator"; // Importing validator
import bcrypt from "bcrypt"; // Importing bcrypt
import jwt from "jsonwebtoken"; // Importing jsonwebtoken

// Creating user schema where it has following fields
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

// Encrypting password before saving it to database
schema.pre("save", async function (next) {
  // this is the document
  if (!this.isModified("password")) return next(); // if password is not modified, then return next
  this.password = await bcrypt.hash(this.password, 10); // if password is modified, then hash it
});

// Comparing password
schema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // this.password is the hashed password
};

// Generating token
schema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "10d", // token expires in 10 days
  });
};

export const User = mongoose.model("User", schema);
