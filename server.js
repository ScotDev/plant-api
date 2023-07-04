const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const app = express();
const port = 3333;

// mongoose
//   .connect(
//     "mongodb://mongo:sIB5IkXZfMJD2riyvdg9@containers-us-west-44.railway.app:7282",
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => {
//     console.log("DB connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// require("./models/User");
// const User = mongoose.model("users");

// Dev only
app.use(cors());

// Facilitates access to paylod of POST/PUT request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load other routes
const authAPI = require("./routes/auth");

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

app.get("/login", (req, res) => {
  res.send("login");
});
app.get("/register", (req, res) => {
  res.send("login");
});

// Use imported routes
app.use("/api", authAPI);

app.listen(port, () => console.log(`Listening on port ${port}`));
