import express from "express";
import {
  addNewCategory,
  addProductImage,
  deleteCategory,
  deleteProduct,
  deleteProductImage,
  getAdminProducts,
  getAllProducts,
  getCategory,
  getProductDetail,
  newProduct,
  updateProducts,
} from "../controllers/product.js";
import { isAuthenticated, verifyAdmin } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/all", getAllProducts);
router.get("/admin", isAuthenticated, verifyAdmin, getAdminProducts);

router
  .route("/single/:id")
  .get(getProductDetail)
  .put(isAuthenticated, verifyAdmin, updateProducts)
  .delete(isAuthenticated, verifyAdmin, deleteProduct);

router.post("/new", isAuthenticated, verifyAdmin, singleUpload, newProduct);

router
  .route("/pictures/:id")
  .post(isAuthenticated, verifyAdmin, singleUpload, addProductImage)
  .delete(isAuthenticated, verifyAdmin, deleteProductImage);

router.post("/category", isAuthenticated, verifyAdmin, addNewCategory);
router.get("/categories", getCategory);
router.delete("/category/:id", isAuthenticated, verifyAdmin, deleteCategory);

export default router;
