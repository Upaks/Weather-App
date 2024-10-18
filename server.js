const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const API_KEY = 'YvV98odF9Gx6E0GaRZTPzt4w1upS8dP8'; // Replace with your AccuWeather API key
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
