'use client';

import { WeatherData } from '@/types/weather';

interface ForecastWeatherProps {
  daily: WeatherData['forecast']['daily'];
  unit: 'metric' | 'imperial';
  convertTemp: (temp: number) => number;
  convertWindSpeed: (speed: number) => number;
}

export default function ForecastWeather({ 
  daily, 
  unit, 
  convertTemp,
  convertWindSpeed 
}: ForecastWeatherProps) {
  const formatDay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {daily.map((day, index) => (
        <div key={index} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="card-body p-4">
            <h3 className="card-title text-lg justify-center">
              {index === 0 ? 'Today' : formatDay(day.date)}
            </h3>
            <div className="flex flex-col items-center">
              <img 
                src={`https://openweathermap.org/img/wn/${day.weather_icon}.png`} 
                alt={day.weather_description}
                className="w-16 h-16"
              />
              <p className="capitalize text-sm text-center">{day.weather_description}</p>
              <div className="flex justify-between w-full mt-2">
                <span className="font-bold">{convertTemp(day.temp_max)}°</span>
                <span className="text-gray-500">{convertTemp(day.temp_min)}°</span>
              </div>
              <div className="w-full mt-2 text-sm">
                <div className="flex justify-between">
                  <span>Humidity:</span>
                  <span>{day.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Wind:</span>
                  <span>
                    {convertWindSpeed(day.wind_speed)} {unit === 'metric' ? 'm/s' : 'mph'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Rain:</span>
                  <span>{day.chance_of_rain}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
