import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchCities, GeocodingResult } from '@/services/weatherService';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSelectCity: (city: GeocodingResult) => void;
}

export function SearchBar({ onSelectCity }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchCitiesDebounced = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const cities = await searchCities(query);
        setResults(cities);
        setShowResults(true);
      } catch (error) {
        console.error('Error searching cities:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchCitiesDebounced, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelectCity = (city: GeocodingResult) => {
    onSelectCity(city);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-10 h-14 text-base border-border bg-card shadow-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {showResults && (results.length > 0 || isLoading) && (
        <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">Searching...</div>
          ) : (
            <ul>
              {results.map((city) => (
                <li key={city.id}>
                  <button
                    onClick={() => handleSelectCity(city)}
                    className={cn(
                      "w-full px-4 py-3 text-left hover:bg-secondary transition-colors",
                      "border-b border-border last:border-b-0"
                    )}
                  >
                    <div className="font-medium text-foreground">{city.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {city.admin1 && `${city.admin1}, `}{city.country}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
