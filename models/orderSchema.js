import mongoose from "mongoose";

const schema = new mongoose.Schema({
  deliveryInformation: {
    location: {
      type: String,
      required: true,
    },
  },
  orderInfo: [
    {
      orderName: {
        type: String,
        required: true,
      },
      orderPrice: {
        type: String,
        required: true,
      },
      orderQuantity: {
        type: Number,
        required: true,
      },
      orderImage: {
        type: String,
        required: true,
      },
      productDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  paymentOption: {
    type: String,
    enum: ["Khalti", "COD"],
    default: "Khalti",
  },
  paidDate: Date,
  paymentInformation: {
    id: String,
    status: String,
  },
  itemPrice: {
    type: Number,
    required: true,
  },
  shippingPrice: {
    type: Number,
    required: true,
  },
  subTotal: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ["Order is being prepared", "Out for delivery", "Delivered"],
    default: "Order is being prepared",
  },
  placedOn: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model("Order", schema);
