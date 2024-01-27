import express from "express"; //importing express module
import { config } from "dotenv"; //importing config module from dotenv
import { errorMiddleware } from "./middlewares/error.js"; //importing error middleware
import cookieParser from "cookie-parser"; //importing cookie parser
import cors from "cors"; //importing cors

config({
  path: "./data/config.env", //path to config.env file
});

export const app = express(); //creating an express app and also exporting it

//using middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], //specifying methods
    origin: [process.env.FRONT_END_URI, process.env.FRONT_END_URI_SECOND],
  })
);

app.get("/", (req, res, next) => {
  res.send("It is Working, wohooo!");
});

// Importing all routes
import user from "./routes/user.js";
import product from "./routes/product.js";
import order from "./routes/order.js";

// Using all routes
app.use("/api/v1/user", user);
app.use("/api/v1/product", product);
app.use("/api/v1/order", order);

// Using error middleware
app.use(errorMiddleware);
