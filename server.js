const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
//load var
dotenv.config({ path: "./config/config.env" });

//connect database
connectDB();

// const app = express();
// app.use(cors());
// //BODY PARSER
// app.use(express.json());
// //cookieparser
// app.use(cookieParser());

// //Rout files
// const hospitals = require("./routes/hospitals");
// app.use("/api/v1/hospitals", hospitals);

// const auth = require("./routes/auth");
// app.use("/api/v1/auth", auth);

// const appointments = require("./routes/appointments");
// app.use("/api/v1/appointments", appointments);

// //handle unhandle promise rejections
// process.on("unhandleRejection", (err, promise) => {
//   console.log(`Error:${err.message}`);
//   server.close(() => process.exit(1));
// });
