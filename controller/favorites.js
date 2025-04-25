// controller/favorites.js
const User = require("../models/User");
const Dentist = require("../models/Dentist"); // Assuming you have a Dentist model

// @desc    Add a dentist to the user's favorites
// @route   POST /api/v1/favorites/:dentistId
// @access  Private
exports.addFavorite = async (req, res, next) => {
  try {
    const { dentistId } = req.params; // Get the dentist ID from the URL
    const userId = req.user._id; // Get the logged-in user's ID from req.user

    // Check if the dentist exists
    const dentist = await Dentist.findById(dentistId);
    if (!dentist) {
      return res.status(404).json({ success: false, msg: "Dentist not found" });
    }

    // Find the user and add the dentist to their favorites if not already added
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Check if the dentist is already a favorite
    if (!user.favorites.includes(dentistId)) {
      user.favorites.push(dentistId); // Add the dentist to favorites
      await user.save();
    }

    res.status(200).json({ success: true, msg: "Dentist added to favorites" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

// @desc    Get all favorite dentists for the logged-in user
// @route   GET /api/v1/favorites
// @access  Private
exports.getFavorites = async (req, res, next) => {
  try {
    const userId = req.user._id; // Get the logged-in user's ID from req.user

    // Find the user and populate their favorites with dentist details
    const user = await User.findById(userId).populate("favorites");
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Send back the list of favorite dentists
    res.status(200).json({ success: true, data: user.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};
