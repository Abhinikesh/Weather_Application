import { CurrentWeather as CurrentWeatherType } from '@/services/weatherService';
import { getWeatherEmoji, getWeatherDescription } from '@/services/weatherService';
import { Droplets, Wind } from 'lucide-react';

interface CurrentWeatherProps {
  weather: CurrentWeatherType;
  location: {
    name: string;
    country: string;
  };
}

export function CurrentWeather({ weather, location }: CurrentWeatherProps) {
  const emoji = getWeatherEmoji(weather.weatherCode, weather.isDay);
  const description = getWeatherDescription(weather.weatherCode);

  return (
    <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-semibold text-foreground mb-1">
          {location.name}
        </h2>
        <p className="text-muted-foreground">{location.country}</p>
      </div>

      <div className="flex items-center justify-center gap-6 mb-8">
        <div className="text-8xl">{emoji}</div>
        <div>
          <div className="text-6xl font-light text-foreground">
            {Math.round(weather.temperature)}°
          </div>
          <div className="text-lg text-muted-foreground mt-2">{description}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-lg">
            <Droplets className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Humidity</div>
            <div className="font-semibold text-foreground">{weather.humidity}%</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-lg">
            <Wind className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Wind</div>
            <div className="font-semibold text-foreground">{Math.round(weather.windSpeed)} km/h</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-lg">
            <span className="text-xl">🌡️</span>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Feels like</div>
            <div className="font-semibold text-foreground">{Math.round(weather.apparentTemperature)}°</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-lg">
            <span className="text-xl">💧</span>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Precipitation</div>
            <div className="font-semibold text-foreground">{weather.precipitation} mm</div>
          </div>
        </div>
      </div>
    </div>
  );
}
