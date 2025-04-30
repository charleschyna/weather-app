'use client';

import { useState } from 'react';
import WeatherDisplay from '@/components/WeatherDisplay';
import SearchBar from '@/components/SearchBar';
import { WeatherData } from '@/types/weather';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchWeather = async (location: string) => {
    if (!location.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError('Error fetching weather data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Weather App</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Get real-time weather information for any location
          </p>
        </div>
        
        <div className="card bg-base-100 shadow-xl p-6 mb-8">
          <SearchBar onSearch={searchWeather} />
        </div>
        
        {loading && (
          <div className="flex justify-center my-8">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        )}
        
        {error && (
          <div className="alert alert-error mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {weatherData && !loading && (
          <WeatherDisplay data={weatherData} />
        )}
      </div>
    </main>
  );
}
