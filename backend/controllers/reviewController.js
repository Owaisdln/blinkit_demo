const Review = require("../models/Review");

// Add Review
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Review already exists",
      });
    }

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Product Reviews
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    }).populate("user", "name");

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addReview,
  getProductReviews,
};