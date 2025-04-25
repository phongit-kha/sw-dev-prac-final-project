// routes/logs.js

const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const { getLogs } = require("../controller/logs");
const { logRequest } = require("../middleware/logger");

const router = express.Router();

router.route("/").get(protect, authorize("admin"), logRequest, getLogs);

module.exports = router;
