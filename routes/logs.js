// routes/logs.js

const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const { getLogs } = require("../controller/logs");

const router = express.Router();

router.route("/").get(protect, authorize("admin"), getLogs);

module.exports = router;
