const express = require("express");
const router = express.Router();
const axios = require("axios");

require("dotenv").config();

// Should check auth state
router.get("/all", async (req, res) => {
  const { lat, long } = req.body;

  //   Should check if correct params/body contents sent
  console.log(lat, long);

  //   Get weatherData for current location with given coords
  //   await axios.get("");

  //   Parse out and return what's needed
  //   .then(response => res.json(response.data))

  //   Handle errors
  res.send("ok");
});

module.exports = router;
