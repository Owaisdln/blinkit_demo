const express = require("express");

const {
  createProduct,
  getProducts,
  getCategories,
  getProduct,
  searchProducts,
} = require("../controllers/productController");

const router = express.Router();

// Create Product
router.post("/", createProduct);

// Get All Products
router.get("/", getProducts);

// Get All Categories
router.get("/categories", getCategories);

// Search Products
router.get("/search", searchProducts);

// Get Single Product
router.get("/:id", getProduct);

module.exports = router;