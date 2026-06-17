const Product = require("../models/Product");

// Create Product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Products + Category Filter
const getProducts = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const products = await Product.find(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Categories
const getCategories = async (req, res) => {
  try {
    const categories =
      await Product.distinct("category");

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Product
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Automatic Alternative Suggestions
    if (product.stock === 0) {
      const substitutes =
        await Product.find({
          category: product.category,
          stock: { $gt: 0 },
          _id: { $ne: product._id },
        }).limit(3);

      return res.status(200).json({
        success: true,
        outOfStock: true,
        message:
          "Product is currently out of stock",
        product,
        substitutes,
      });
    }

    res.status(200).json({
      success: true,
      outOfStock: false,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search Products
const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.q || "";

    const products = await Product.find({
      name: {
        $regex: keyword,
        $options: "i",
      },
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getCategories,
  getProduct,
  searchProducts,
};