export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  isDay: boolean;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  location: {
    name: string;
    country: string;
  };
}

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query.trim()) return [];
  
  const response = await fetch(`${GEOCODING_API}?name=${encodeURIComponent(query)}&count=5`);
  const data = await response.json();
  
  return data.results || [];
}

export async function getWeatherByCoordinates(
  latitude: number,
  longitude: number,
  locationName: string,
  country: string
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,is_day',
    hourly: 'temperature_2m,precipitation_probability,weather_code',
    timezone: 'auto',
    forecast_days: '1'
  });

  const response = await fetch(`${WEATHER_API}?${params}`);
  const data = await response.json();

  return {
    current: {
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      isDay: data.current.is_day === 1
    },
    hourly: data.hourly.time.slice(0, 24).map((time: string, index: number) => ({
      time,
      temperature: data.hourly.temperature_2m[index],
      weatherCode: data.hourly.weather_code[index],
      precipitationProbability: data.hourly.precipitation_probability[index] || 0
    })),
    location: {
      name: locationName,
      country
    }
  };
}

export function getWeatherEmoji(weatherCode: number, isDay: boolean = true): string {
  // WMO Weather interpretation codes
  if (weatherCode === 0) return isDay ? '☀️' : '🌙';
  if (weatherCode <= 3) return isDay ? '🌤️' : '🌙';
  if (weatherCode <= 48) return '🌫️';
  if (weatherCode <= 57) return '🌧️';
  if (weatherCode <= 67) return '🌧️';
  if (weatherCode <= 77) return '🌨️';
  if (weatherCode <= 82) return '🌧️';
  if (weatherCode <= 86) return '🌨️';
  if (weatherCode === 95) return '⛈️';
  if (weatherCode <= 99) return '⛈️';
  return '🌤️';
}

export function getWeatherDescription(weatherCode: number): string {
  if (weatherCode === 0) return 'Clear sky';
  if (weatherCode <= 3) return 'Partly cloudy';
  if (weatherCode <= 48) return 'Foggy';
  if (weatherCode <= 57) return 'Drizzle';
  if (weatherCode <= 67) return 'Rain';
  if (weatherCode <= 77) return 'Snow';
  if (weatherCode <= 82) return 'Rain showers';
  if (weatherCode <= 86) return 'Snow showers';
  if (weatherCode === 95) return 'Thunderstorm';
  if (weatherCode <= 99) return 'Thunderstorm with hail';
  return 'Unknown';
}
