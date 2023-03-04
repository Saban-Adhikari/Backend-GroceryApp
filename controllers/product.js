import { asyncError } from "../middlewares/error.js";
import { Product } from "../models/productSchema.js";
import { Category } from "../models/categorySchema.js";
import ErrorHandler from "../utils/error.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

export const getAllProducts = asyncError(async (req, res, next) => {
  const { keyword, category } = req.query;

  const products = await Product.find({
    productName: {
      $regex: keyword ? keyword : "",
      $options: "i",
    },
    category: category ? category : undefined,
  });

  res.status(200).json({
    success: true,
    products,
  });
});

export const getAdminProducts = asyncError(async (req, res, next) => {
  const products = await Product.find({}).populate("category");

  const notInStock = products.filter((i) => i.availableStock == 0);

  res.status(200).json({
    success: true,
    products,
    notInStock: notInStock.length,
    availableStock: products.length - notInStock.length,
  });
});

export const getProductDetail = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product)
    return next(
      new ErrorHandler("The product you were searching was not found!", 404)
    );

  res.status(200).json({
    success: true,
    product,
  });
});

export const newProduct = asyncError(async (req, res, next) => {
  const {
    productName,
    productDescription,
    productPrice,
    availableStock,
    category,
  } = req.body;

  if (!req.file)
    return next(new ErrorHandler("Adding image is required!", 400));

  const file = getDataUri(req.file);

  const result = await cloudinary.v2.uploader.upload(file.content);

  const image = {
    public_id: result.public_id,
    url: result.secure_url,
  };

  await Product.create({
    productName,
    productDescription,
    productPrice,
    availableStock,
    category,
    productImage: [image],
  });

  res.status(200).json({
    success: true,
    message: "New product added successfully!",
  });
});

export const updateProducts = asyncError(async (req, res, next) => {
  const {
    productName,
    productDescription,
    productPrice,
    availableStock,
    category,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product)
    return next(
      new ErrorHandler("The product you were searching was not found!", 404)
    );

  if (productName) product.productName = productName;
  if (productDescription) product.productDescription = productDescription;
  if (productPrice) product.productPrice = productPrice;
  if (category) product.category = category;
  if (availableStock) product.availableStock = availableStock;

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product details have been updated successfully!",
  });
});

export const addProductImage = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product)
    return next(
      new ErrorHandler("The product you were searching was not found!", 404)
    );

  if (!req.file)
    return next(new ErrorHandler("Adding image is required!", 400));

  const file = getDataUri(req.file);

  const result = await cloudinary.v2.uploader.upload(file.content);

  const image = {
    public_id: result.public_id,
    url: result.secure_url,
  };

  product.productImage.push(image);
  await product.save();

  res.status(200).json({
    success: true,
    message: "Image has been added, success!!!",
  });
});

export const deleteProductImage = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product)
    return next(
      new ErrorHandler("The product you were searching was not found!", 404)
    );

  const id = req.query.id;

  if (!id) return next(new ErrorHandler("Please enter image id", 400));

  let isExist = -1;
  product.productImage.forEach((item, index) => {
    if (item._id.toString() === id.toString()) isExist = index;
  });

  if (isExist < 0)
    return next(
      new ErrorHandler("The target image doesn't seem to exist!", 400)
    );

  await cloudinary.v2.uploader.destroy(product.productImage[isExist].public_id);

  product.productImage.splice(isExist, 1);

  await product.save();

  res.status(200).json({
    success: true,
    message: "The image has been deleted, success!!!",
  });
});

export const deleteProduct = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product)
    return next(
      new ErrorHandler("The product you were searching was not found!", 404)
    );

  for (let index = 0; index < product.productImage.length; index++) {
    await cloudinary.v2.uploader.destroy(product.productImage[index].public_id);
  }
  await product.remove();

  res.status(200).json({
    success: true,
    message: "The product has been deleted, success!!!",
  });
});

export const addNewCategory = asyncError(async (req, res, next) => {
  await Category.create(req.body);

  res.status(201).json({
    success: true,
    message: "Category has been added, success!",
  });
});

export const getCategory = asyncError(async (req, res, next) => {
  const categories = await Category.find({});

  res.status(200).json({
    success: true,
    categories,
  });
});

export const deleteCategory = asyncError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category)
    return next(new ErrorHandler("Specified category not found!", 404));

  const products = await Product.find({ category: category._id });

  for (let index = 0; index < products.length; index++) {
    const product = products[index];
    product.category = undefined;

    await product.save();
  }

  await category.remove();

  res.status(200).json({
    success: true,
    message: "The chosen category has been deleted, success!",
  });
});
