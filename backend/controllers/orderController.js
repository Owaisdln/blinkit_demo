const Order = require("../models/Order");
const Product = require("../models/Product");

// Place Order
const placeOrder = async (req, res) => {
  try {
    const { items } = req.body;

    let itemsTotal = 0;

    for (const item of items) {
      const product = await Product.findById(
        item.product
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        const substitutes =
          await Product.find({
            category: product.category,
            stock: { $gt: 0 },
            _id: { $ne: product._id },
          }).limit(3);

        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
          substitutes,
        });
      }

      itemsTotal +=
        product.discountPrice *
        item.quantity;

      product.stock -= item.quantity;

      await product.save();
    }

    let deliveryFee = 0;

    if (itemsTotal < 99) {
      deliveryFee = 20;
    }

    const packagingFee = 5;

    let surgeFee = 0;

    const currentHour =
      new Date().getHours();

    if (
      currentHour >= 19 &&
      currentHour <= 23
    ) {
      surgeFee = 20;
    }

    const totalAmount =
      itemsTotal +
      deliveryFee +
      packagingFee +
      surgeFee;

    const order = await Order.create({
      user: req.user.id,
      items,
      itemsTotal,
      deliveryFee,
      packagingFee,
      surgeFee,
      totalAmount,
      status: "Placed",
    });

    res.status(201).json({
      success: true,
      message: "Order Placed Successfully",

      bill: {
        itemsTotal,
        deliveryFee,
        packagingFee,
        surgeFee,
        totalAmount,
      },

      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Order History
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate(
        "items.product",
        "name image price category"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Single Order
const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    ).populate(
      "items.product",
      "name image price category"
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

// Cancel Order Within 60 Seconds
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.user.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message:
          "Order already cancelled",
      });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({
        success: false,
        message:
          "Delivered orders cannot be cancelled",
      });
    }

    const timeDifference =
      Date.now() -
      new Date(order.createdAt).getTime();

    const sixtySeconds =
      60 * 1000;

    if (
      timeDifference > sixtySeconds
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Order is already being packed and cannot be cancelled.",
      });
    }

    // Restore Inventory
    for (const item of order.items) {
      const product =
        await Product.findById(
          item.product
        );

      if (product) {
        product.stock +=
          item.quantity;

        await product.save();
      }
    }

    order.status = "Cancelled";

    await order.save();

    res.status(200).json({
      success: true,
      message:
        "Order cancelled successfully",
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
  placeOrder,
  getMyOrders,
  getSingleOrder,
  cancelOrder,
};