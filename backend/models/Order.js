const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    itemsTotal: {
      type: Number,
      default: 0,
    },

    deliveryFee: {
      type: Number,
      default: 0,
    },

    packagingFee: {
      type: Number,
      default: 5,
    },

    surgeFee: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Placed",
        "Packed",
        "Out For Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Placed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);