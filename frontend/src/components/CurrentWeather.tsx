'use client';

import { WeatherData } from '@/types/weather';

interface CurrentWeatherProps {
  current: WeatherData['current'];
  unit: 'metric' | 'imperial';
  convertTemp: (temp: number) => number;
  convertWindSpeed: (speed: number) => number;
}

export default function CurrentWeather({ 
  current, 
  unit, 
  convertTemp,
  convertWindSpeed 
}: CurrentWeatherProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center">
              <img 
                src={`https://openweathermap.org/img/wn/${current.weather_icon}@2x.png`} 
                alt={current.weather_description}
                className="w-20 h-20"
              />
              <div>
                <h2 className="text-5xl font-bold">
                  {convertTemp(current.temp)}°{unit === 'metric' ? 'C' : 'F'}
                </h2>
                <p className="text-xl capitalize">{current.weather_description}</p>
              </div>
            </div>
            <p className="text-lg mt-2">
              Feels like: {convertTemp(current.feels_like)}°{unit === 'metric' ? 'C' : 'F'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {formatTime(current.timestamp)}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-item">
              <div className="stat-title">Humidity</div>
              <div className="stat-value text-xl">{current.humidity}%</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-title">Wind</div>
              <div className="stat-value text-xl">
                {convertWindSpeed(current.wind_speed)} {unit === 'metric' ? 'm/s' : 'mph'}
              </div>
              <div className="stat-desc">{current.wind_direction}</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-title">Pressure</div>
              <div className="stat-value text-xl">{current.pressure} hPa</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-title">Visibility</div>
              <div className="stat-value text-xl">{(current.visibility / 1000).toFixed(1)} km</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
