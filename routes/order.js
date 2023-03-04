import express from "express";
import {
  createNewOrder,
  getAdminOrders,
  myOrderDetail,
  myOrders,
  processOrder,
} from "../controllers/order.js";
import { isAuthenticated, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new", isAuthenticated, createNewOrder);

router.get("/my", isAuthenticated, myOrders);

router.get("/admin", isAuthenticated, verifyAdmin, getAdminOrders);

router
  .route("/single/:id")
  .get(isAuthenticated, myOrderDetail)
  .put(isAuthenticated, verifyAdmin, processOrder);

export default router;
