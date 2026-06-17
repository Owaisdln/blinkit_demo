const Cart = require("../models/Cart");

// Add To Cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cartItem = await Cart.create({
      user: req.user.id,
      product: productId,
      quantity,
    });

    res.status(201).json({
      success: true,
      cartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({
      user: req.user.id,
    }).populate("product");

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Cart Item
const removeCartItem = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeCartItem,
};