# Weather App Backend

This is the Laravel backend API for the Weather App. It serves as a proxy to the OpenWeatherMap API.

## Requirements

- PHP >= 8.1
- Composer
- Laravel 10.x

## Installation

1. Install Composer from [getcomposer.org](https://getcomposer.org/download/)
2. Run `composer create-project laravel/laravel .` in this directory
3. Copy `.env.example` to `.env` and configure your environment variables
4. Add your OpenWeatherMap API key to the `.env` file:
   ```
   OPENWEATHERMAP_API_KEY=your_api_key_here
   ```
5. Run `php artisan serve` to start the development server

## API Endpoints

### GET /api/weather

Get current weather and forecast data for a location.

**Parameters:**
- `location` (required): City name or location (e.g., "London", "New York", "Tokyo")
- `units` (optional): Units of measurement. Options: "metric" (default) or "imperial"

**Example Response:**
```json
{
  "location": {
    "name": "London",
    "country": "GB",
    "lat": 51.5074,
    "lon": -0.1278
  },
  "current": {
    "temp": 15.2,
    "feels_like": 14.8,
    "humidity": 76,
    "wind_speed": 4.1,
    "wind_direction": "NE",
    "weather_condition": "Clouds",
    "weather_description": "scattered clouds",
    "weather_icon": "03d",
    "pressure": 1013,
    "visibility": 10000,
    "uv_index": 5.2,
    "timestamp": 1619712000
  },
  "forecast": {
    "daily": [...],
    "hourly": [...]
  },
  "units": {
    "temperature": "°C",
    "wind_speed": "m/s"
  }
}
```
