// routes/favorites.js
const express = require("express");
const { addFavorite, getFavorites } = require("../controller/favorites");
const { protect, authorize } = require("../middleware/auth"); // Ensure the user is logged in
const { logRequest } = require("../middleware/logger");

const router = express.Router();

// Route to add a dentist to the user's favorites
router
  .route("/:dentistId")
  .post(protect, authorize("admin", "user"), logRequest, addFavorite);

// Route to get all favorite dentists for the logged-in user
router
  .route("/")
  .get(protect, authorize("admin", "user"), logRequest, getFavorites);

module.exports = router;
