import mongoose from "mongoose";

// Category Schema
const schema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Enter the category for the product!!"],
  },
});

export const Category = mongoose.model("Category", schema); // Category Model
