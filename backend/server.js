const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const cache = new NodeCache({ stdTTL: 1800 }); // Cache for 30 minutes

// Middleware
app.use(cors());
app.use(express.json());

// API key
const API_KEY = 'cfe1875378f92145629050b40d35e189';

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    app: 'Weather App API',
    version: '1.0.0',
    status: 'running'
  });
});

// Weather API endpoint
app.get('/api/weather', async (req, res) => {
  try {
    const { location, units = 'metric' } = req.query;

    if (!location) {
      return res.status(400).json({ error: 'Location parameter is required' });
    }

    // Create a cache key based on location and units
    const cacheKey = `weather_${location}_${units}`;

    // Check if we have cached data
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Get coordinates for the location
    const geoResponse = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q: location,
        limit: 1,
        appid: API_KEY
      }
    });

    if (!geoResponse.data || geoResponse.data.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const { lat, lon, name, country } = geoResponse.data[0];

    // Get weather data using coordinates
    const weatherResponse = await axios.get('https://api.openweathermap.org/data/3.0/onecall', {
      params: {
        lat,
        lon,
        units,
        exclude: 'minutely,alerts',
        appid: API_KEY
      }
    });

    if (!weatherResponse.data) {
      return res.status(500).json({ error: 'Failed to fetch weather data' });
    }

    // Format the response
    const formattedData = formatWeatherData(weatherResponse.data, { name, country, lat, lon }, units);

    // Cache the data
    cache.set(cacheKey, formattedData);

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    
    // Handle OpenWeatherMap API errors
    if (error.response && error.response.data) {
      return res.status(error.response.status || 500).json({
        error: error.response.data.message || 'Failed to fetch weather data'
      });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Format weather data for the frontend
function formatWeatherData(data, locationData, units) {
  // Get wind direction as a string
  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    return directions[Math.round(degrees / 45)];
  };

  // Format daily forecast data
  const daily = data.daily.slice(0, 5).map(day => ({
    date: new Date(day.dt * 1000).toISOString().split('T')[0],
    temp_max: day.temp.max,
    temp_min: day.temp.min,
    weather_condition: day.weather[0].main,
    weather_description: day.weather[0].description,
    weather_icon: day.weather[0].icon,
    humidity: day.humidity,
    wind_speed: day.wind_speed,
    chance_of_rain: Math.round(day.pop * 100)
  }));

  // Format hourly forecast data
  const hourly = data.hourly.slice(0, 24).map(hour => ({
    time: new Date(hour.dt * 1000).toISOString(),
    temp: hour.temp,
    weather_condition: hour.weather[0].main,
    weather_icon: hour.weather[0].icon
  }));

  // Build the response
  return {
    location: {
      name: locationData.name || 'Unknown',
      country: locationData.country || '',
      lat: locationData.lat,
      lon: locationData.lon
    },
    current: {
      temp: data.current.temp,
      feels_like: data.current.feels_like,
      humidity: data.current.humidity,
      wind_speed: data.current.wind_speed,
      wind_direction: getWindDirection(data.current.wind_deg),
      weather_condition: data.current.weather[0].main,
      weather_description: data.current.weather[0].description,
      weather_icon: data.current.weather[0].icon,
      pressure: data.current.pressure,
      visibility: data.current.visibility,
      uv_index: data.current.uvi,
      timestamp: data.current.dt
    },
    forecast: {
      daily,
      hourly
    },
    units: {
      temperature: units === 'metric' ? '°C' : '°F',
      wind_speed: units === 'metric' ? 'm/s' : 'mph'
    }
  };
}

// Start the server
app.listen(port, () => {
  console.log(`Weather App backend server running on http://localhost:${port}`);
});
