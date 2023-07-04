const express = require("express");
const router = express.Router();
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
require("dotenv").config();

const { authenticateJWT } = require("../firebase.js");
const checkForUser = (id) => {
  return User.exists({ googleUid: id });
};

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

require("../models/User");
const User = mongoose.model("users");

router.post("/login", authenticateJWT, (req, res) => {
  //   console.log(req.headers.authorization);
  res.send("ok");
});

// const corsOptions = {
//   origin: ["http://localhost:5173", "https://beaulife.netlify.app/"],
// };

// router.post("/register", cors(corsOptions));
router.post("/register", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://beaulife.netlify.app");
  console.log(req.body);
  checkForUser(req.body.googleUid).then((doc) => {
    if (!doc) {
      console.log("Created new user", req.body.googleUid);
      const newUser = {
        UUID: uuidv4(),
        userName: req.body.userName,
        email: req.body.email,
        googleUid: req.body.googleUid,
        photoUrl: req.body.photoUrl,
        subscription: "inactive",
      };
      new User(newUser).save().then(() => {
        (user) => {
          console.log(user);
        };
      });
      // res.header("Access-Control-Allow-Origin", "*");
      return res.sendStatus(201);
    } else {
      // res.header("Access-Control-Allow-Origin", "*");
      res.sendStatus(302);
    }
  });
});

router.get("/user/:id", authenticateJWT, (req, res) => {
  const userID = req.params.id;
  User.findOne({
    googleUid: userID,
  })
    .then((user) => {
      res.json({
        userName: user.userName,
        email: user.email,
        photoUrl: user.photoUrl,
        subscription: user.subscription,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});
module.exports = router;
