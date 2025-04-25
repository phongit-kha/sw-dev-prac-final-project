// middleware/logger.js
const Log = require("../models/Log");

// Log each request to the database
exports.logRequest = async (req, res, next) => {
  try {
    // Assuming you have a user object attached to req.user (from authentication middleware)
    const user = req.user ? req.user._id : null; // Get the user ID from the request (authentication should add this)

    const logMessage = `${user} is ${req.method} to ${req.originalUrl}`; // e.g., 'GET /api/v1/logs'

    const rawBody = req.rawBody || null;
    // Save the log to the database
    await Log.create({
      user: user, // Log the user ID
      message: logMessage, // Log the message
      method: req.method, // Log the HTTP method (e.g., GET, POST)
      path: req.originalUrl, // Log the URL of the request
      rawBody: rawBody, // Log the request body
    });

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Error logging request:", err);
    next(); // Allow the request to continue even if the log fails
  }
};
