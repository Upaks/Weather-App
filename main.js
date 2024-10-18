
const countryDropdown = document.getElementById('country');
const cityDropdown = document.getElementById('city');
const getWeatherButton = document.getElementById('getWeather');
const weatherResult = document.getElementById('weatherResult');

// Enable the weather button only when a city is selected
cityDropdown.addEventListener('change', () => {
  getWeatherButton.disabled = !cityDropdown.value;
});

// Function to show a loading message
function showLoading() {
  weatherResult.innerHTML = '<p>Loading...</p>';
}

// Function to populate the city dropdown based on selected country
async function populateCityDropdown(countryCode) {
  try {
    const response = await axios.get(`http://dataservice.accuweather.com/locations/v1/adminareas/${countryCode}`, {
      params: {
        apikey: "" // Use environment variable
      }
    });

    // Clear the previous city options
    cityDropdown.innerHTML = '<option value="">--Select a City--</option>';

    // Populate city dropdown
    response.data.forEach(location => {
      const option = document.createElement('option');
      option.value = location.LocalizedName; // Use LocalizedName for city name
      option.text = location.LocalizedName;
      cityDropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching city data:', error);
    weatherResult.innerHTML = `<p>Error fetching cities: ${error.message}</p>`;
  }
}

// Handle country selection
countryDropdown.addEventListener('change', () => {
  const selectedCountry = countryDropdown.value;
  if (selectedCountry) {
    populateCityDropdown(selectedCountry);
  } else {
    cityDropdown.innerHTML = '<option value="">--Select a City--</option>';
    getWeatherButton.disabled = true;
  }
});

// Function to display weather data
function displayWeather(weatherData) {
  const { WeatherText, Temperature, HasPrecipitation, PrecipitationType } = weatherData;

  let weatherInfo = `
    <h2>Weather: ${WeatherText}</h2>
    <p>Temperature: ${Temperature.Metric.Value}°C</p>
    <p>Has Precipitation: ${HasPrecipitation ? 'Yes' : 'No'}</p>
  `;

  if (HasPrecipitation && PrecipitationType) {
    weatherInfo += `<p>Precipitation Type: ${PrecipitationType}</p>`;
  }

  weatherResult.innerHTML = weatherInfo;
}

// Handle "Get Weather" button click
getWeatherButton.addEventListener('click', async () => {
  const selectedCity = cityDropdown.value;
  showLoading(); // Show loading message

  try {
    // Get Location Key from your backend (Express server)
    const locationResponse = await axios.get(`http://localhost:3000/location/${selectedCity}`);
    const locationKey = locationResponse.data[0].Key;

    // Get Weather Data from your backend (Express server)
    const weatherResponse = await axios.get(`http://localhost:3000/weather/${locationKey}`);
    const weatherData = weatherResponse.data[0];

    // Display the weather data on the frontend
    displayWeather(weatherData);
  } catch (error) {
    weatherResult.innerHTML = `<p>Error fetching weather data: ${error.message}</p>`;
  }
});
