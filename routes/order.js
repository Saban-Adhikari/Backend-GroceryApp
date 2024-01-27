import express from "express"; // Import express
import {
  // Import the following functions from controllers/order.js
  createNewOrder,
  getAdminOrders,
  myOrderDetail,
  myOrders,
  processOrder,
} from "../controllers/order.js";
import { isAuthenticated, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router(); // Create a router

router.post("/new", isAuthenticated, createNewOrder); // Create a new order

router.get("/my", isAuthenticated, myOrders); // Get all orders of users

router.get("/admin", isAuthenticated, verifyAdmin, getAdminOrders); // Get all orders for admin

router
  .route("/single/:id")
  .get(isAuthenticated, myOrderDetail)
  .put(isAuthenticated, verifyAdmin, processOrder); // Get a single order for admin

export default router;
