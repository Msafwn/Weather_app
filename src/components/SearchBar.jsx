import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { searchCity } from '../api/weatherService';
import useDebounce from '../hooks/useDebounce';

export default function SearchBar({ onSelectCity, onUseCurrentLocation, isGeoLoading }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed || trimmed.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsSearching(false);
      return;
    }

    let isMounted = true;
    const fetchSuggestions = async () => {
      try {
        setIsSearching(true);
        const results = await searchCity(trimmed, 5);
        if (isMounted) {
          setSuggestions(results);
          setIsOpen(results.length > 0);
          setSelectedIndex(-1);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to search city:', err);
          setSuggestions([]);
        }
      } finally {
        if (isMounted) setIsSearching(false);
      }
    };

    fetchSuggestions();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    onSelectCity(city);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const popularCities = [
    { name: 'Karachi', latitude: 24.8607, longitude: 67.0011, country: 'Pakistan' },
    { name: 'Lahore', latitude: 31.5204, longitude: 74.3587, country: 'Pakistan' },
    { name: 'Islamabad', latitude: 33.6844, longitude: 73.0479, country: 'Pakistan' },
    { name: 'Dubai', latitude: 25.2048, longitude: 55.2708, country: 'UAE' },
    { name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'UK' },
    { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan' },
  ];

  const isTyping = query !== debouncedQuery;

  return (
    <div className="weather-glass-panel relative z-10 mx-auto w-full space-y-3 rounded-2xl p-3 sm:p-4" ref={dropdownRef}>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center text-slate-400">
            {isSearching || (isTyping && query.length >= 2) ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <Search className="w-4 h-4 text-slate-400" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            placeholder="Search city..."
            className="w-full rounded-xl border border-white/80 bg-white/70 py-3 pl-10 pr-9 text-sm text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setIsOpen(false);
              }}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* GPS location button */}
        <button
          onClick={onUseCurrentLocation}
          disabled={isGeoLoading}
          title="Use current location"
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50/80 px-3.5 py-2.5 text-xs font-semibold text-blue-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-100 active:scale-95 disabled:opacity-50"
        >
          {isGeoLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          ) : (
            <MapPin className="w-4 h-4 text-blue-600" />
          )}
          <span>Location</span>
        </button>

        {/* Dropdown */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-white/80 bg-white/95 shadow-xl shadow-slate-900/10 backdrop-blur-xl divide-y divide-slate-100">
            {suggestions.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <button
                  key={`${item.id || idx}-${item.latitude}`}
                  onClick={() => handleSelect(item)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-medium text-slate-900">{item.name}</span>
                    {item.admin1 && (
                      <span className="text-xs text-slate-500">({item.admin1})</span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {item.country || 'Region'}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Popular quick chips */}
      <div className="flex items-center gap-2 flex-wrap px-1">
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Popular:</span>
        {popularCities.map((c) => (
          <button
            key={c.name}
            onClick={() => onSelectCity(c)}
            className="rounded-full border border-white/90 bg-white/55 px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:text-blue-700"
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
