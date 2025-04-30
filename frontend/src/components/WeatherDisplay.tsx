'use client';

import { useState } from 'react';
import { WeatherData } from '@/types/weather';
import CurrentWeather from './CurrentWeather';
import ForecastWeather from './ForecastWeather';
import HourlyForecast from './HourlyForecast';

interface WeatherDisplayProps {
  data: WeatherData;
}

export default function WeatherDisplay({ data }: WeatherDisplayProps) {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  
  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };
  
  // Temperature conversion function
  const convertTemp = (temp: number): number => {
    if (unit === 'imperial') {
      return Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp);
  };
  
  // Wind speed conversion
  const convertWindSpeed = (speed: number): number => {
    if (unit === 'imperial') {
      return Math.round(speed * 2.237 * 10) / 10; // m/s to mph
    }
    return Math.round(speed * 10) / 10; // keep as m/s
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Weather for {data.location.name}, {data.location.country}
        </h2>
        <button 
          onClick={toggleUnit} 
          className="btn btn-sm btn-outline"
        >
          Switch to {unit === 'metric' ? '°F' : '°C'}
        </button>
      </div>
      
      <CurrentWeather 
        current={data.current} 
        unit={unit} 
        convertTemp={convertTemp}
        convertWindSpeed={convertWindSpeed}
      />
      
      <div className="divider">Hourly Forecast</div>
      
      <HourlyForecast 
        hourly={data.forecast.hourly} 
        unit={unit} 
        convertTemp={convertTemp} 
      />
      
      <div className="divider">5-Day Forecast</div>
      
      <ForecastWeather 
        daily={data.forecast.daily} 
        unit={unit} 
        convertTemp={convertTemp}
        convertWindSpeed={convertWindSpeed}
      />
    </div>
  );
}
