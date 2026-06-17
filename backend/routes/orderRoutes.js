const express = require("express");

const {
  placeOrder,
  getMyOrders,
  getSingleOrder,
  cancelOrder,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, placeOrder);

router.get("/", protect, getMyOrders);

router.get("/:id", protect, getSingleOrder);

router.post(
  "/:id/cancel",
  protect,
  cancelOrder
);

module.exports = router;