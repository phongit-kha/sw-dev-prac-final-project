const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getDentists,
  getDentist,
  createDentist,
  updateDentist,
  deleteDentist,
} = require("../controller/dentists");

//include other resource routers
const bookingRouter = require("./bookings");
const { logRequest } = require("../middleware/logger");

const router = express.Router();

//Re-route into other resource routers
router.use("/:dentistId/bookings/", bookingRouter);

router
  .route("/")
  .get(logRequest, getDentists)
  .post(protect, authorize("admin"), logRequest, createDentist);
router
  .route("/:id")
  .get(logRequest, getDentist)
  .put(protect, authorize("admin"), logRequest, updateDentist)
  .delete(protect, authorize("admin"), logRequest, deleteDentist);

module.exports = router;
