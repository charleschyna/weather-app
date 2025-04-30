'use client';

import { WeatherData } from '@/types/weather';

interface HourlyForecastProps {
  hourly: WeatherData['forecast']['hourly'];
  unit: 'metric' | 'imperial';
  convertTemp: (temp: number) => number;
}

export default function HourlyForecast({ 
  hourly, 
  unit, 
  convertTemp 
}: HourlyForecastProps) {
  const formatHour = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit' });
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-4 pb-2" style={{ minWidth: 'max-content' }}>
        {hourly.map((hour, index) => (
          <div key={index} className="flex flex-col items-center w-24">
            <span className="text-sm font-medium">
              {index === 0 ? 'Now' : formatHour(hour.time)}
            </span>
            <img 
              src={`https://openweathermap.org/img/wn/${hour.weather_icon}.png`} 
              alt={hour.weather_condition}
              className="w-12 h-12 my-1"
            />
            <span className="font-bold">
              {convertTemp(hour.temp)}°{unit === 'metric' ? 'C' : 'F'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
