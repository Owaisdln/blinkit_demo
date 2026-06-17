const Address = require("../models/Address");

// Add Address
const addAddress = async (req, res) => {
  try {
    const address = await Address.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Addresses
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Address
const updateAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Address
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(
      req.params.id
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
};