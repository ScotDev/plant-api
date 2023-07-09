const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

console.log(process.env.IS_DEV);

const corsOptions = {
  // origin: https://beaulife.netlify.app,
  origin: process.env.IS_DEV ? "*" : "https://beaulife.netlify.app",
};

app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  max: process.env.IS_DEV ? 300 : 30, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// Facilitates access to paylod of POST/PUT request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// Load other routes
const authAPI = require("./routes/auth");
const weatherAPI = require("./routes/weather");

app.get("/", (req, res) => {
  return res.send("Hello World!");
});

app.get("/uuid", (req, res) => {
  const id = uuidv4();
  console.log(id);
  return res.send(id);
});

app.post("/", (req, res) => {
  return res.send("Received a POST HTTP method");
});

app.put("/:Id", (req, res) => {
  return res.send(`PUT HTTP method on user/${req.params.Id} resource`);
});

// app.get("/login", (req, res) => {
//   res.send("login");
// });
// app.get("/register", (req, res) => {
//   res.send("login");
// });

// Use imported routes
app.use("/auth", authAPI);
app.use("/weather", weatherAPI);

// app.options("*", cors());
// app.options("/api/*", cors(corsOptions));

app.listen(port, "0.0.0.0", () => console.log(`Listening on port ${port}`));
