const express = require("express");

const {
  addToCart,
  getCart,
  removeCartItem,
} = require("../controllers/cartController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addToCart);

router.get("/", protect, getCart);

router.delete("/remove/:id", protect, removeCartItem);

module.exports = router;