<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class WeatherController extends Controller
{
    /**
     * Get weather data for a location
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getWeather(Request $request)
    {
        // Validate request parameters
        $request->validate([
            'location' => 'required|string|max:100',
            'units' => 'nullable|string|in:metric,imperial',
        ]);

        $location = $request->input('location');
        $units = $request->input('units', 'metric');
        
        // Cache key based on location and units
        $cacheKey = "weather_{$location}_{$units}";
        
        // Check if we have cached data (cache for 30 minutes)
        return Cache::remember($cacheKey, 1800, function () use ($location, $units) {
            // Get coordinates for the location
            $geoData = $this->getCoordinates($location);
            
            if (!$geoData) {
                return response()->json([
                    'error' => 'Location not found',
                ], 404);
            }
            
            // Get weather data using coordinates
            $weatherData = $this->getWeatherByCoordinates(
                $geoData['lat'],
                $geoData['lon'],
                $units
            );
            
            if (!$weatherData) {
                return response()->json([
                    'error' => 'Failed to fetch weather data',
                ], 500);
            }
            
            return response()->json($weatherData);
        });
    }
    
    /**
     * Get coordinates for a location name
     *
     * @param  string  $location
     * @return array|null
     */
    private function getCoordinates($location)
    {
        try {
            $response = Http::get('https://api.openweathermap.org/geo/1.0/direct', [
                'q' => $location,
                'limit' => 1,
                'appid' => env('OPENWEATHERMAP_API_KEY'),
            ]);
            
            if ($response->successful() && count($response->json()) > 0) {
                $data = $response->json()[0];
                return [
                    'name' => $data['name'],
                    'country' => $data['country'],
                    'lat' => $data['lat'],
                    'lon' => $data['lon'],
                ];
            }
            
            return null;
        } catch (\Exception $e) {
            \Log::error('Error fetching coordinates: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Get weather data using coordinates
     *
     * @param  float  $lat
     * @param  float  $lon
     * @param  string  $units
     * @return array|null
     */
    private function getWeatherByCoordinates($lat, $lon, $units)
    {
        try {
            // Fetch current weather and forecast in one call
            $response = Http::get('https://api.openweathermap.org/data/3.0/onecall', [
                'lat' => $lat,
                'lon' => $lon,
                'units' => $units,
                'exclude' => 'minutely,alerts',
                'appid' => env('OPENWEATHERMAP_API_KEY'),
            ]);
            
            if (!$response->successful()) {
                return null;
            }
            
            $data = $response->json();
            
            // Get location details
            $locationResponse = Http::get('https://api.openweathermap.org/geo/1.0/reverse', [
                'lat' => $lat,
                'lon' => $lon,
                'limit' => 1,
                'appid' => env('OPENWEATHERMAP_API_KEY'),
            ]);
            
            $locationData = $locationResponse->json()[0] ?? null;
            
            // Format the response
            return $this->formatWeatherData($data, $locationData, $units);
        } catch (\Exception $e) {
            \Log::error('Error fetching weather data: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Format weather data for the frontend
     *
     * @param  array  $data
     * @param  array|null  $locationData
     * @param  string  $units
     * @return array
     */
    private function formatWeatherData($data, $locationData, $units)
    {
        // Get wind direction as a string
        $getWindDirection = function($degrees) {
            $directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
            return $directions[round($degrees / 45)];
        };
        
        // Format daily forecast data
        $daily = [];
        foreach (array_slice($data['daily'], 0, 5) as $day) {
            $daily[] = [
                'date' => date('Y-m-d', $day['dt']),
                'temp_max' => $day['temp']['max'],
                'temp_min' => $day['temp']['min'],
                'weather_condition' => $day['weather'][0]['main'],
                'weather_description' => $day['weather'][0]['description'],
                'weather_icon' => $day['weather'][0]['icon'],
                'humidity' => $day['humidity'],
                'wind_speed' => $day['wind_speed'],
                'chance_of_rain' => round($day['pop'] * 100),
            ];
        }
        
        // Format hourly forecast data
        $hourly = [];
        foreach (array_slice($data['hourly'], 0, 24) as $hour) {
            $hourly[] = [
                'time' => date('Y-m-d H:i:s', $hour['dt']),
                'temp' => $hour['temp'],
                'weather_condition' => $hour['weather'][0]['main'],
                'weather_icon' => $hour['weather'][0]['icon'],
            ];
        }
        
        // Build the response
        return [
            'location' => [
                'name' => $locationData['name'] ?? 'Unknown',
                'country' => $locationData['country'] ?? '',
                'lat' => $data['lat'], 
                'lon' => $data['lon'], 
            ],
            'current' => [
                'temp' => $data['current']['temp'],
                'feels_like' => $data['current']['feels_like'],
                'humidity' => $data['current']['humidity'],
                'wind_speed' => $data['current']['wind_speed'],
                'wind_direction' => $getWindDirection($data['current']['wind_deg']),
                'weather_condition' => $data['current']['weather'][0]['main'],
                'weather_description' => $data['current']['weather'][0]['description'],
                'weather_icon' => $data['current']['weather'][0]['icon'],
                'pressure' => $data['current']['pressure'],
                'visibility' => $data['current']['visibility'],
                'uv_index' => $data['current']['uvi'],
                'timestamp' => $data['current']['dt'],
            ],
            'forecast' => [
                'daily' => $daily,
                'hourly' => $hourly,
            ],
            'units' => [
                'temperature' => $units === 'metric' ? '°C' : '°F',
                'wind_speed' => $units === 'metric' ? 'm/s' : 'mph',
            ],
        ];
    }
}
