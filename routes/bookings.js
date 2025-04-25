const express = require("express");
const {
  getBookings,
  getBooking,
  addBooking,
  updateBooking,
  deleteBooking,
} = require("../controller/bookings");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");
const { logRequest } = require("../middleware/logger");

router
  .route("/")
  .get(protect, logRequest, getBookings)
  .post(protect, authorize("admin", "user"), logRequest, addBooking);
router
  .route("/:id")
  .get(protect, logRequest, getBooking)
  .put(protect, authorize("admin", "user"), logRequest, updateBooking)
  .delete(protect, authorize("admin", "user"), logRequest, deleteBooking);

module.exports = router;
