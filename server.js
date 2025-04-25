const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logRequest = require("./middleware/logger"); // Import the logger middleware

//load var
dotenv.config({ path: "./config/config.env" });

//connect database
connectDB();

const app = express();
app.use(cors());
// //BODY PARSER
app.use(express.json());
// //cookieparser
app.use(cookieParser());
// //Rout files
const dentists = require("./routes/dentists");
app.use("/api/v1/dentists", dentists);

const auth = require("./routes/auth");
app.use("/api/v1/auth", auth);

const bookings = require("./routes/bookings");
app.use("/api/v1/bookings", bookings);

const logs = require("./routes/logs");
app.use("/api/v1/logs", logs);

const favoritesRoute = require("./routes/favorites");
app.use("/api/v1/favorites", favoritesRoute);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    "Server running in ",
    process.env.NODE_ENV,
    " mode on port ",
    PORT
  )
);

//handle unhandle promise rejections
process.on("unhandleRejection", (err, promise) => {
  console.log(`Error:${err.message}`);
  server.close(() => process.exit(1));
});
