import { asyncError } from "../middlewares/error.js";

import { Order } from "../models/orderSchema.js";

import { Product } from "../models/productSchema.js";
import ErrorHandler from "../utils/error.js";

export const createNewOrder = asyncError(async (req, res, next) => {
  const {
    deliveryInformation,
    orderInfo,
    paymentOption,
    paymentInformation,
    itemPrice,
    shippingPrice,
    subTotal,
  } = req.body;

  await Order.create({
    user: req.user._id,
    deliveryInformation,
    orderInfo,
    paymentOption,
    paymentInformation,
    itemPrice,
    shippingPrice,
    subTotal,
  });
  for (let index = 0; index < orderInfo.length; index++) {
    const product = await Product.findById(orderInfo[index].productDetail);
    product.availableStock -= orderInfo[index].orderQuantity;
    await product.save();
  }

  res.status(201).json({
    success: true,
    message: "Your order has been placed, success!",
  });
});

export const getAdminOrders = asyncError(async (req, res, next) => {
  const orders = await Order.find({});

  res.status(200).json({
    success: true,
    orders,
  });
});

export const myOrders = asyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

export const myOrderDetail = asyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new ErrorHandler("Order cannot be found! ", 404));

  res.status(200).json({
    success: true,
    order,
  });
});

export const processOrder = asyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new ErrorHandler("Order cannot be found! ", 404));

  if (order.orderStatus === "Order is being prepared")
    order.orderStatus = "Out for delivery";
  else if (order.orderStatus === "Out for delivery") {
    order.orderStatus = "Delivered";
  } else
    return next(new ErrorHandler("Order has already been delivered!", 400));

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order has been processed, success!",
  });
});
