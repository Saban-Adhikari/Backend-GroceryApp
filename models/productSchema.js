import mongoose from "mongoose";

const schema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Add the name of the product!!!"],
  },
  productDescription: {
    type: String,
    required: [true, "Description is required for the product!"],
  },
  productPrice: {
    type: Number,
    required: [true, "Add the price for the product!!!"],
  },
  availableStock: {
    type: Number,
    required: [true, "Enter the available stock of the product!"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  productImage: [
    {
      public_id: String,
      url: String,
    },
  ],
});

export const Product = mongoose.model("Product", schema);
