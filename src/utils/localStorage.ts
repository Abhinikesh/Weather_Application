export interface RecentSearch {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

const RECENT_SEARCHES_KEY = 'weather-recent-searches';
const MAX_RECENT_SEARCHES = 5;

export function getRecentSearches(): RecentSearch[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(search: Omit<RecentSearch, 'timestamp'>): void {
  const searches = getRecentSearches();
  
  // Remove duplicate if exists
  const filtered = searches.filter(
    s => !(s.name === search.name && s.country === search.country)
  );
  
  // Add new search at the beginning
  const updated = [
    { ...search, timestamp: Date.now() },
    ...filtered
  ].slice(0, MAX_RECENT_SEARCHES);
  
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

export function clearRecentSearches(): void {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}
