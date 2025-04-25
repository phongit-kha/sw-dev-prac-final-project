// controller/logs.js
const Log = require("../models/Log");

// @desc    Get all logs
// @route   GET /api/v1/logs
// @access  Private
exports.getLogs = async (req, res, next) => {
  try {
    const logs = await Log.find().sort({ createAt: -1 });
    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server Error" });
    console.log(err.stack);
  }
};
