// Import the express package
const express = require("express");

// Create a new router object
const router = express.Router();

// Import the axios package
const axios = require("axios");

// Import the dotenv package
require("dotenv").config();

router.get("/daily", async (req, res) => {
  const { lat, long } = req.query;
  const date = new Date();
  const formattedDate = date.toLocaleString();
  console.log(formattedDate, req.query);
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
      return res.status(200).send({
        updatedTime,
        location: { name, country },
        current: { temp_c, condition, wind_mph, humidity, vis_miles },
        data: dailyData,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).send({ error: "Error contacting weather API" });
    }
  }

  //   Handle errors
  return res.status(400).send({ error: "No coords recieved" });
});

router.get("/hourly", async (req, res) => {
  const { lat, long } = req.query;

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
      return res.status(404).send({ error: "Error contacting weather API" });
    }
  }

  //   Handle errors
  return res.status(400).send({ error: "No coords recieved" });
});

const formatCountry = (country) => {
  if (country === "United Kingdom") {
    return "UK";
  } else if (country === "United States of America") {
    return "USA";
  } else {
    return country;
  }
};

router.get("/all", async (req, res) => {
  const { lat, long } = req.query;

  console.log(req.query);

  if (lat && long) {
    try {
      const apiRes = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${long}&days=7&aqi=no&alerts=no`
      );

      // Split data into now, daily, and hourly
      // Now
      const { temp_c, condition, wind_mph, humidity, vis_miles, is_day } =
        apiRes.data.current;
      const conditionText = condition.text;
      const { name, region, country } = apiRes.data.location;
      const formattedCountry = formatCountry(country);
      const { maxtemp_c, mintemp_c } = apiRes.data.forecast.forecastday[0].day;
      // Hourly
      const hourlyData = [];
      const todayForecastDataArr = await apiRes.data.forecast.forecastday[0]
        .hour;
      const tomorrowForecastDataArr = await apiRes.data.forecast.forecastday[1]
        .hour;
      const now = Date.now() / 1000;
      await todayForecastDataArr.forEach((item) => {
        if (item.time_epoch > now) {
          hourlyData.push({
            time: item.time,
            condition: item.condition.text,
            temp_c: Math.trunc(item.temp_c),
          });
        }
      });

      const limit = 24 - hourlyData.length;
      for (let index = 0; index < limit; index++) {
        const item = tomorrowForecastDataArr[index];
        hourlyData.push({
          time: item.time,
          condition: item.condition.text,
          temp_c: Math.trunc(item.temp_c),
        });
      }

      // Daily
      const dailyForecastDataArr = await apiRes.data.forecast.forecastday;
      const dailyData = [];

      await dailyForecastDataArr.forEach((item) => {
        dailyData.push({
          date: item.date,
          condition: item.day.condition.text,
          maxtemp_c: Math.trunc(item.day.maxtemp_c),
          mintemp_c: Math.trunc(item.day.mintemp_c),
          maxwind_mph: Math.trunc(item.day.maxwind_mph),
          avgvis_miles: item.day.avgvis_miles,
          avghumidity: item.day.avghumidity,
          uv: item.day.uv,
          //   Annoyingly wind direction only available at hourly level
        });
      });

      return res.status(200).send({
        now: {
          temp_c: Math.trunc(temp_c),
          condition: conditionText,
          wind_mph: Math.trunc(wind_mph),
          humidity,
          vis_miles,
          maxtemp_c: Math.trunc(maxtemp_c),
          mintemp_c: Math.trunc(mintemp_c),
          is_day: is_day === 1 ? true : false,
        },
        location: { name, region, country: formattedCountry },
        data: { hourlyData, dailyData },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(404)
        .send({ error: "Error contacting external resource" });
    }
  }

  return res.status(400).send({ error: "No coords recieved" });
});

router.get("/search", async (req, res) => {
  const query = req.query.query;
  console.log(query);
  if (query) {
    try {
      const apiRes = await axios.get(
        `https://api.weatherapi.com/v1/search.json?key=${process.env.WEATHER_API_KEY}&q=${query}`
      );
      return res.status(200).send(apiRes.data);
    } catch (error) {
      console.log(error);
      return res
        .status(404)
        .send({ error: "Error contacting external resource" });
    }
  }
});

module.exports = router;
