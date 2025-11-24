import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { CurrentWeather } from '@/components/CurrentWeather';
import { HourlyForecast } from '@/components/HourlyForecast';
import { RecentSearches } from '@/components/RecentSearches';
import { GeocodingResult, getWeatherByCoordinates, WeatherData } from '@/services/weatherService';
import { addRecentSearch, RecentSearch } from '@/utils/localStorage';
import { Loader2 } from 'lucide-react';

export default function Weather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateKey, setUpdateKey] = useState(0);

  const fetchWeather = async (
    latitude: number,
    longitude: number,
    name: string,
    country: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getWeatherByCoordinates(latitude, longitude, name, country);
      setWeatherData(data);
      addRecentSearch({ name, country, latitude, longitude });
      setUpdateKey(prev => prev + 1);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Error fetching weather:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCity = (city: GeocodingResult) => {
    fetchWeather(city.latitude, city.longitude, city.name, city.country);
  };

  const handleSelectRecentSearch = (search: RecentSearch) => {
    fetchWeather(search.latitude, search.longitude, search.name, search.country);
  };

  // Load default city on mount
  useEffect(() => {
    fetchWeather(40.7128, -74.0060, 'New York', 'United States');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Weather App</h1>
          <p className="text-muted-foreground">Simple, clean weather information</p>
        </header>

        <div className="mb-8 flex justify-center">
          <SearchBar onSelectCity={handleSelectCity} />
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center text-destructive mb-8">
            {error}
          </div>
        )}

        {!isLoading && weatherData && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <CurrentWeather
                weather={weatherData.current}
                location={weatherData.location}
              />
              <HourlyForecast hourly={weatherData.hourly} />
            </div>

            <div className="lg:col-span-1">
              <RecentSearches
                key={updateKey}
                onSelectSearch={handleSelectRecentSearch}
                onUpdate={() => setUpdateKey(prev => prev + 1)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
