import mongoose from "mongoose";

const schema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Enter the category for the product!!"],
  },
});

export const Category = mongoose.model("Category", schema);
