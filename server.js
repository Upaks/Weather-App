import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const API_KEY = process.env.ACCUWEATHER_API_KEY; // Replace with your AccuWeather API key
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/location/:city', async (req, res) => {
  const city = req.params.city;
  try {
    const response = await axios.get(
      `http://dataservice.accuweather.com/locations/v1/cities/search`, 
      {
        params: {
          apikey: API_KEY,
          q: city,
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching location data' });
  }
});

app.get('/weather/:locationKey', async (req, res) => {
  const locationKey = req.params.locationKey;
  try {
    const response = await axios.get(
      `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}`, 
      {
        params: {
          apikey: API_KEY,
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
