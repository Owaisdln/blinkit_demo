const express = require("express");

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/:productId",
  protect,
  addToWishlist
);

router.get(
  "/",
  protect,
  getWishlist
);

router.delete(
  "/:productId",
  protect,
  removeFromWishlist
);

module.exports = router;