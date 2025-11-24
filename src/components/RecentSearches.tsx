import { MapPin, Trash2 } from 'lucide-react';
import { getRecentSearches, clearRecentSearches, RecentSearch } from '@/utils/localStorage';
import { Button } from '@/components/ui/button';

interface RecentSearchesProps {
  onSelectSearch: (search: RecentSearch) => void;
  onUpdate: () => void;
}

export function RecentSearches({ onSelectSearch, onUpdate }: RecentSearchesProps) {
  const recentSearches = getRecentSearches();

  if (recentSearches.length === 0) {
    return null;
  }

  const handleClear = () => {
    clearRecentSearches();
    onUpdate();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Searches</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="space-y-2">
        {recentSearches.map((search, index) => (
          <button
            key={index}
            onClick={() => onSelectSearch(search)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
          >
            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground truncate">{search.name}</div>
              <div className="text-sm text-muted-foreground">{search.country}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
