# Weather App

A modern weather application with a decoupled architecture featuring a NextJS frontend and Laravel backend.

## Architecture Overview

This application follows a decoupled architecture with:

- **Frontend**: NextJS with TypeScript and Tailwind CSS for styling
- **Backend**: Laravel API that serves as a proxy to the OpenWeatherMap API
- **External API**: OpenWeatherMap API for weather data

## Project Structure

```
weather-app/
├── frontend/          # NextJS application
│   ├── src/           # Source code
│   │   ├── app/       # Next.js App Router
│   │   ├── components/# React components
│   │   └── types/     # TypeScript type definitions
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
└── backend/           # Laravel API
    ├── app/           # Application code
    │   └── Http/
    │       └── Controllers/
    │           └── WeatherController.php
    ├── routes/        # API routes
    │   └── api.php
    └── .env.example   # Environment variables example
```

## Features

- Current weather conditions
- 3-day weather forecast
- Location search
- Temperature unit conversion (°C/°F)
- Wind status information
- Humidity information
- Responsive design for all devices
- API caching for improved performance

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- PHP (v8.1+)
- Composer
- OpenWeatherMap API key (sign up at [openweathermap.org](https://openweathermap.org/api))

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Access the frontend at http://localhost:3000

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   composer install
   ```

3. Copy the environment file and configure:
   ```
   copy .env.example .env
   ```

4. Add your OpenWeatherMap API key to the `.env` file:
   ```
   OPENWEATHERMAP_API_KEY=your_api_key_here
   ```

5. Generate application key:
   ```
   php artisan key:generate
   ```

6. Start the Laravel development server:
   ```
   php -S localhost:8000 -t public
   ```
   
   Or use the provided batch file:
   ```
   start.bat
   ```

7. The API will be available at http://localhost:8000

## Running the Complete Application

1. Start the backend server first (from the backend directory):
   ```
   php -S localhost:8000 -t public
   ```

2. Start the frontend development server (from the frontend directory):
   ```
   npm run dev
   ```

3. Open your browser and navigate to http://localhost:3000

## API Endpoints

### GET /api/weather

Get current weather and forecast data for a location.

**Parameters:**
- `location` (required): City name or location (e.g., "London", "New York")
- `units` (optional): Units of measurement. Options: "metric" (default) or "imperial"

## Development Notes

- The frontend uses the fetch API to make AJAX requests to the backend
- The backend implements caching to reduce API calls to OpenWeatherMap
- CORS is configured to allow requests from the frontend

## Future Improvements

- Add user accounts to save favorite locations
- Implement geolocation for automatic weather detection
- Add weather maps and radar
- Implement PWA features for offline access
- Add weather alerts and notifications
