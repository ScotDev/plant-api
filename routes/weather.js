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

router.get("/daily", async (req, res) => {
  const { lat, long } = req.query;
  // console.log(lat, long);
  console.log(req.query);
  const updatedTime = Date.now();
  // const options = {
  //   year: "numeric",
  //   month: "2-digit",
  //   day: "2-digit",
  // };

  // const formattedDate = new Intl.DateTimeFormat("en-GB", options)
  //   .format(updatedTime)
  //   .replace(/\//g, "-");
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

      await forecastDataArr.forEach((item) => {
        // If item.date_epoch !== today, push to dailyData
        // Generate code to format Date.now() to match item.date_epoch format
        // const APIdate = new Date(item.date);
        // const formattedDate2 = new Intl.DateTimeFormat("en-GB", options)
        //   .format(APIdate)
        //   .replace(/\//g, "-");

        dailyData.push({
          date: item.date,
          condition: item.day.condition.text,
          maxtemp_c: item.day.maxtemp_c,
          mintemp_c: item.day.mintemp_c,
          maxwind_mph: item.day.maxwind_mph,
          avgvis_miles: item.day.avgvis_miles,
          avghumidity: item.day.avghumidity,
          uv: item.day.uv,
          //   Annoyingly wind direction only available at hourly level
        });
      });
      //   console.log(dailyData);
      //   console.log(apiRes.data);
      return res.status(200).send({
        updatedTime,
        location: { name, country },
        current: { temp_c, condition, wind_mph, humidity, vis_miles },
        data: dailyData,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).send({ erroMsg: "Error contacting weather API" });
    }
  }

  //   Handle errors
  return res.status(400).send({ erroMsg: "No coords recieved" });
});
router.post("/daily", async (req, res) => {
  const { lat, long } = req.body;
  const updatedTime = Date.now();
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
          //   Annoyingly wind direction only available at hourly level
        });
      });
      //   console.log(dailyData);
      //   console.log(apiRes.data);
      return res.status(200).send({
        updatedTime,
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

router.post("/hourly", async (req, res) => {
  const { lat, long } = req.body;

  if (lat && long) {
    try {
      const apiRes = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${long}&days=2&aqi=no&alerts=no`
      );

      const todayForecastDataArr = await apiRes.data.forecast.forecastday[0]
        .hour;
      const tomorrowForecastDataArr = await apiRes.data.forecast.forecastday[1]
        .hour;
      //   console.log(forecastDataArr);
      const hourlyData = [];
      //   Date object returns epoch time in milliseconds, API returns it in seconds
      //   It was either convert one to seconds or 24 to milliseconds
      const now = Date.now() / 1000;
      //   console.log(now.toFixed(0));
      await todayForecastDataArr.forEach((item) => {
        // console.log(item.time_epoch);
        // console.log(item.time_epoch > now);
        if (item.time_epoch > now) {
          hourlyData.push({
            time: item.time,
            condition: item.condition.text,
            temp_c: item.temp_c,
          });
        }
      });

      const limit = 24 - hourlyData.length;
      console.log(limit);
      for (let index = 0; index < limit; index++) {
        const item = tomorrowForecastDataArr[index];
        // console.log(item);
        hourlyData.push({
          time: item.time,
          condition: item.condition.text,
          temp_c: item.temp_c,
        });
      }

      return res.status(200).send({
        // current: { temp_c, condition, wind_mph, humidity, vis_miles },
        data: hourlyData,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).send({ erroMsg: "Error contacting weather API" });
    }
  }

  //   Handle errors
  return res.status(400).send({ erroMsg: "No coords recieved" });
});

module.exports = router;
