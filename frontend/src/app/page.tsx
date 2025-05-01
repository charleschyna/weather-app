'use client';

import { useState } from 'react';
import { WeatherData } from '@/types/weather';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');

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

  const toggleTempUnit = () => {
    setTempUnit(tempUnit === 'C' ? 'F' : 'C');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4">
      <div className="w-full max-w-4xl border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col space-y-6">
          {/* Search Bar - Section A and B */}
          <div className="flex items-center space-x-2">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search city..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && searchWeather((e.target as HTMLInputElement).value)}
              />
            </div>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => {
                const input = document.querySelector('input') as HTMLInputElement;
                searchWeather(input.value);
              }}
            >
              GO
            </button>
          </div>

          <div className="flex">
            {/* Current Weather - Sections D, E, F, G */}
            <div className="w-1/3 border-r border-gray-200 pr-4">
              <div className="flex flex-col items-center">
                <div className="text-center">
                  {weatherData ? (
                    <>
                      <div className="mb-2">
                        <img 
                          src={`https://openweathermap.org/img/wn/${weatherData.current.weather_icon}@2x.png`} 
                          alt={weatherData.current.weather_description}
                          className="w-24 h-24 mx-auto"
                        />
                      </div>
                      <div className="text-4xl font-bold mb-1">
                        {tempUnit === 'C' 
                          ? Math.round(weatherData.current.temp) 
                          : Math.round((weatherData.current.temp * 9/5) + 32)
                        } °{tempUnit}
                      </div>
                      <div className="text-xl mb-4">{weatherData.current.weather_description}</div>
                      <div className="text-sm text-gray-600">
                        {new Date().toLocaleDateString('en-US', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="text-sm text-gray-600">{weatherData.location.name}</div>
                    </>
                  ) : (
                    <div className="text-center text-gray-400">
                      <div className="mb-2">
                        <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M50 75C63.8071 75 75 63.8071 75 50C75 36.1929 63.8071 25 50 25C36.1929 25 25 36.1929 25 50C25 63.8071 36.1929 75 50 75Z" stroke="currentColor" strokeWidth="2"/>
                          <path d="M50 35V50L60 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div className="text-4xl font-bold mb-1">-- °C</div>
                      <div className="text-xl mb-4">Weather</div>
                      <div className="text-sm">
                        {new Date().toLocaleDateString('en-US', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="text-sm">Location</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Weather Forecast - Section H */}
            <div className="w-2/3 pl-4">
              <div className="flex flex-col h-full">
                {/* 3-Day Forecast */}
                <div className="flex justify-between mb-6">
                  {weatherData ? (
                    weatherData.forecast.daily.slice(0, 3).map((day, index) => {
                      const date = new Date(day.date);
                      return (
                        <div key={index} className="w-1/3 text-center px-2">
                          <div className="text-sm font-medium mb-2">
                            {index === 0 ? 'Today' : date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                          </div>
                          <div className="mb-2">
                            <img 
                              src={`https://openweathermap.org/img/wn/${day.weather_icon}.png`} 
                              alt={day.weather_description}
                              className="w-16 h-16 mx-auto"
                            />
                          </div>
                          <div className="text-sm">
                            {tempUnit === 'C' 
                              ? `${Math.round(day.temp_min)}-${Math.round(day.temp_max)} °C` 
                              : `${Math.round((day.temp_min * 9/5) + 32)}-${Math.round((day.temp_max * 9/5) + 32)} °F`
                            }
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    Array(3).fill(0).map((_, index) => (
                      <div key={index} className="w-1/3 text-center px-2 text-gray-400">
                        <div className="text-sm font-medium mb-2">
                          {index === 0 ? 'Today' : `${index + 21} May`}
                        </div>
                        <div className="mb-2">
                          <svg className="w-16 h-16 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="2"/>
                            {index % 2 === 0 ? (
                              <>
                                <line x1="50" y1="25" x2="50" y2="15" stroke="currentColor" strokeWidth="2"/>
                                <line x1="50" y1="85" x2="50" y2="75" stroke="currentColor" strokeWidth="2"/>
                                <line x1="25" y1="50" x2="15" y2="50" stroke="currentColor" strokeWidth="2"/>
                                <line x1="85" y1="50" x2="75" y2="50" stroke="currentColor" strokeWidth="2"/>
                                <line x1="67.5" y1="32.5" x2="75" y2="25" stroke="currentColor" strokeWidth="2"/>
                                <line x1="32.5" y1="67.5" x2="25" y2="75" stroke="currentColor" strokeWidth="2"/>
                                <line x1="67.5" y1="67.5" x2="75" y2="75" stroke="currentColor" strokeWidth="2"/>
                                <line x1="32.5" y1="32.5" x2="25" y2="25" stroke="currentColor" strokeWidth="2"/>
                              </>
                            ) : (
                              <path d="M35 40C35 40 40 35 50 35C60 35 65 40 65 40C65 40 60 45 50 45C40 45 35 40 35 40Z" fill="currentColor"/>
                            )}
                          </svg>
                        </div>
                        <div className="text-sm">--°C</div>
                      </div>
                    ))
                  )}
                </div>

                {/* Wind and Humidity - Sections I and J */}
                <div className="flex justify-between mt-auto">
                  <div className="w-1/2 pr-2">
                    <div className="border border-gray-200 rounded-md p-4">
                      <div className="text-sm text-gray-500 mb-2">Wind Status</div>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold">
                          {weatherData ? weatherData.current.wind_speed : '--'} km/h
                        </div>
                        <div className="text-gray-400">
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M9 13L12 16L15 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        {weatherData ? weatherData.current.wind_direction : 'WSW'}
                      </div>
                    </div>
                  </div>
                  <div className="w-1/2 pl-2">
                    <div className="border border-gray-200 rounded-md p-4">
                      <div className="text-sm text-gray-500 mb-2">Humidity</div>
                      <div className="text-3xl font-bold mb-2">
                        {weatherData ? weatherData.current.humidity : '--'}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: weatherData ? `${weatherData.current.humidity}%` : '0%' }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0</span>
                        <span>50</span>
                        <span>100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Temperature Unit Toggle - Section C */}
          <div className="absolute top-6 right-6">
            <button 
              onClick={toggleTempUnit}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium hover:bg-gray-300 focus:outline-none"
            >
              °{tempUnit === 'C' ? 'F' : 'C'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
