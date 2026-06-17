const Wishlist = require("../models/Wishlist");

// Add To Wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const existing = await Wishlist.findOne({
      user: req.user.id,
      product: productId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    const wishlist = await Wishlist.create({
      user: req.user.id,
      product: productId,
    });

    res.status(201).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Wishlist
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.user.id,
    }).populate("product");

    res.status(200).json({
      success: true,
      count: wishlist.length,
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove From Wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOneAndDelete({
      user: req.user.id,
      product: productId,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist",
      });
    }

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};