const express = require("express");
const router = express.Router();
const axios = require("axios");

require("dotenv").config();

// Should check auth state
router.post("/now", async (req, res) => {
  const { lat, long } = req.body;

  //   Should check if correct params/body contents sent
  //   console.log(lat, long);
  console.log(req.body);

  //   Get weatherData for current location with given coords
  if (lat && long) {
    try {
      const apiRes = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${long}&aqi=no`
      );
      //   console.log(apiRes.data);
      return res.status(200).send(apiRes.data);
    } catch (error) {
      console.log(error);
      res.status(404).send({ erroMsg: "Error contacting weather API" });
    }
  }

  //   Parse out and return what's needed
  //   .then(response => res.json(response.data))

  //   Handle errors
  return res.status(400).send({ erroMsg: "No coords recieved" });
});

router.post("/daily", async (req, res) => {
  const { lat, long } = req.body;

  if (lat && long) {
    try {
      const apiRes = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${long}&days=7&aqi=no&alerts=no`
      );
      //   console.log(apiRes.data);
      const { name, country } = apiRes.data.location;
      const { temp_c, condition, wind_mph, humidity, vis_miles } =
        apiRes.data.current;
      //   console.log(parsedLocation.name, parsedLocation.country);
      const forecastDataArr = await apiRes.data.forecast.forecastday;
      const dailyData = [];
      console.log(apiRes.data.location);
      await forecastDataArr.forEach((item) => {
        dailyData.push({
          date: item.date,
          condition: item.day.condition.text,
          maxtemp_c: item.day.maxtemp_c,
          mintemp_c: item.day.mintemp_c,
          maxwind_mph: item.day.maxwind_mph,
          avgvis_miles: item.day.avgvis_miles,
          avghumidity: item.day.avghumidity,
          uv: item.day.uv,
          //   Annoyingly wind speed only available at hourly level
        });
      });
      //   console.log(dailyData);
      //   console.log(apiRes.data);
      return res.status(200).send({
        location: { name, country },
        current: { temp_c, condition, wind_mph, humidity, vis_miles },
        data: dailyData,
      });
    } catch (error) {
      console.log(error);
      res.status(404).send({ erroMsg: "Error contacting weather API" });
    }
  }

  //   Handle errors
  return res.status(400).send({ erroMsg: "No coords recieved" });
});

module.exports = router;
