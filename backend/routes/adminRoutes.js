const express = require("express");

const {
  getDashboard,
  updateOrderStatus,
} = require("../controllers/adminController");

const router = express.Router();

router.get(
  "/dashboard",
  getDashboard
);

router.put(
  "/orders/:id/status",
  updateOrderStatus
);

module.exports = router;