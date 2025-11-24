import { HourlyForecast as HourlyForecastType } from '@/services/weatherService';
import { getWeatherEmoji } from '@/services/weatherService';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HourlyForecastProps {
  hourly: HourlyForecastType[];
}

export function HourlyForecast({ hourly }: HourlyForecastProps) {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true 
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-foreground mb-4">24-Hour Forecast</h3>
      
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {hourly.map((hour, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-secondary rounded-lg p-4 min-w-[100px] text-center"
            >
              <div className="text-sm font-medium text-muted-foreground mb-2">
                {formatTime(hour.time)}
              </div>
              <div className="text-4xl mb-2">
                {getWeatherEmoji(hour.weatherCode)}
              </div>
              <div className="text-lg font-semibold text-foreground mb-1">
                {Math.round(hour.temperature)}°
              </div>
              {hour.precipitationProbability > 0 && (
                <div className="text-xs text-primary">
                  💧 {hour.precipitationProbability}%
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
