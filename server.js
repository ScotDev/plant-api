// Import express and cors packages
const express = require("express");
const cors = require("cors");

// Import uuid package to generate random IDs
const { v4: uuidv4 } = require("uuid");

// Import mongoose package to connect to MongoDB
const mongoose = require("mongoose");

// Import rate-limit package to limit number of requests
const rateLimit = require("express-rate-limit");

// Load environment variables from .env file
require("dotenv").config();

// Initialize express
const app = express();

// Set port number
const port = process.env.PORT || 3000;

// Set CORS options
const corsOptions = {
  origin: process.env.IS_DEV ? "*" : "https://beaulife.netlify.app",
};

// Enable CORS
app.use(cors(corsOptions));

// Set rate limit
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  max: process.env.IS_DEV ? 300 : 30, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// Facilitates access to paylod of POST/PUT request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load other routes
const authAPI = require("./routes/auth");
const weatherAPI = require("./routes/weather");

// Set default route
app.get("/", (req, res) => {
  return res.send("Hello World!");
});

// Set route to generate a random ID
app.get("/uuid", (req, res) => {
  const id = uuidv4();
  console.log(id);
  return res.send(id);
});

// Use imported routes
app.use("/auth", authAPI);
app.use("/weather", weatherAPI);

// Listen to port
app.listen(port, "0.0.0.0", () => console.log(`Listening on port ${port}`));
