export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    wind_direction: string;
    weather_condition: string;
    weather_description: string;
    weather_icon: string;
    pressure: number;
    visibility: number;
    uv_index: number;
    timestamp: number;
  };
  forecast: {
    daily: Array<{
      date: string;
      temp_max: number;
      temp_min: number;
      weather_condition: string;
      weather_description: string;
      weather_icon: string;
      humidity: number;
      wind_speed: number;
      chance_of_rain: number;
    }>;
    hourly: Array<{
      time: string;
      temp: number;
      weather_condition: string;
      weather_icon: string;
    }>;
  };
  units: {
    temperature: string;
    wind_speed: string;
  };
}
