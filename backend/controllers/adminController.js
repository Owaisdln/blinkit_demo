const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// Dashboard Analytics
const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalProducts =
      await Product.countDocuments();

    const totalOrders =
      await Order.countDocuments();

    const orders = await Order.find();

    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.totalAmount,
      0
    );

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Order Status
const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Placed",
      "Packed",
      "Out For Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order =
      await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
  updateOrderStatus,
};