import DataUriParser from "datauri/parser.js";
import path from "path";
//import { createTransport } from "nodemailer";
import mailgun from "mailgun-js";

export const getDataUri = (file) => {
  const parser = new DataUriParser();
  const extensionName = path.extname(file.originalname).toString();
  return parser.format(extensionName, file.buffer);
};

export const sendToken = (user, res, message, statusCode) => {
  const token = user.generateToken();

  res
    .status(statusCode)
    .cookie("token", token, {
      ...cookieOptions,
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    })
    .json({
      success: true,
      message: message,
    });
};

export const cookieOptions = {
  secure: process.env.NODE_ENV === "Development" ? false : true,
  httpOnly: process.env.NODE_ENV === "Development" ? false : true,
  sameSite: process.env.NODE_ENV === "Development" ? false : "none",
};

export const sendEmail = async (subject, to, text) => {
  const DOMAIN = process.env.MAILGUN_DOMAIN;
  const API_KEY = process.env.MAILGUN_API_KEY;
  const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

  const data = {
    from: "appthegrocery@gmail.com",
    to,
    subject,
    text,
  };

  await mg.messages().send(data);
};
