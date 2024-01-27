import { app } from "./app.js"; //importing app from app.js
import { connectDB } from "./data/database.js"; //importing connectDB from database.js
import cloudinary from "cloudinary"; //importing cloudinary

connectDB(); //calling connectDB function

//configuring cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME, //getting cloud name from config.env
  api_key: process.env.CLOUDINARY_API_KEY, //getting api key from config.env
  api_secret: process.env.CLOUDINARY_API_SECRET, //getting api secret from config.env
});

//listening to port
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port: ${process.env.PORT}`);
});
