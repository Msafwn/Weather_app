import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getWeatherData,
  getUserLocationByIP,
  reverseGeocode,
} from './api/weatherService';
import { getWeatherCondition } from './utils/weatherCodes';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import { AlertCircle, CloudSun, Loader2, RefreshCw } from 'lucide-react';

const FALLBACK_CITY = {
  name: 'Karachi',
  latitude: 24.8607,
  longitude: 67.0011,
  country: 'Pakistan',
  admin1: 'Sindh',
};

function getLocationFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('city');
  const latitudeParam = params.get('lat');
  const longitudeParam = params.get('lon');
  const latitude = Number(latitudeParam);
  const longitude = Number(longitudeParam);

  if (
    !name ||
    latitudeParam === null ||
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitudeParam === null ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return {
    name,
    latitude,
    longitude,
    country: params.get('country') || '',
    admin1: params.get('region') || '',
  };
}

function getUnitFromUrl() {
  return new URLSearchParams(window.location.search).get('unit')?.toUpperCase() === 'F'
    ? 'F'
    : 'C';
}

export default function App() {
  const [selectedCity, setSelectedCity] = useState(getLocationFromUrl);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState(getUnitFromUrl);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const cityRef = useRef(selectedCity);
  cityRef.current = selectedCity;

  const convertTemp = (celsius) => {
    if (celsius === null || celsius === undefined) return '--';
    return Math.round(unit === 'F' ? (celsius * 9) / 5 + 32 : celsius);
  };

  const fetchWeather = useCallback(async (city, isRefresh = false) => {
    if (!city) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const data = await getWeatherData(city.latitude, city.longitude);
      setWeatherData(data);
      setLastUpdated(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to fetch live weather data. Please check connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCity) return undefined;

    let isCancelled = false;
    const setFallbackLocation = async () => {
      const ipCity = await getUserLocationByIP();
      if (!isCancelled) setSelectedCity(ipCity || FALLBACK_CITY);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            const geoInfo = await reverseGeocode(coords.latitude, coords.longitude);
            if (!isCancelled) {
              setSelectedCity({
                name: geoInfo.name,
                latitude: coords.latitude,
                longitude: coords.longitude,
                country: geoInfo.country || 'Pakistan',
                admin1: geoInfo.admin1 || '',
              });
            }
          } catch (err) {
            console.error('Unable to resolve current location:', err);
            await setFallbackLocation();
          }
        },
        () => {
          void setFallbackLocation();
        },
        { timeout: 4000 }
      );
    } else {
      void setFallbackLocation();
    }

    return () => {
      isCancelled = true;
    };
  }, [selectedCity]);

  useEffect(() => {
    if (selectedCity) void fetchWeather(selectedCity);
  }, [selectedCity, fetchWeather]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (cityRef.current) void fetchWeather(cityRef.current, true);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('unit', unit);

    if (selectedCity) {
      url.searchParams.set('city', selectedCity.name);
      url.searchParams.set('lat', selectedCity.latitude);
      url.searchParams.set('lon', selectedCity.longitude);
      if (selectedCity.country) url.searchParams.set('country', selectedCity.country);
      else url.searchParams.delete('country');
      if (selectedCity.admin1) url.searchParams.set('region', selectedCity.admin1);
      else url.searchParams.delete('region');
    }

    window.history.replaceState(
      window.history.state,
      '',
      `${url.pathname}${url.search}${url.hash}`
    );
  }, [selectedCity, unit]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const geoInfo = await reverseGeocode(coords.latitude, coords.longitude);
          setSelectedCity({
            name: geoInfo.name,
            latitude: coords.latitude,
            longitude: coords.longitude,
            country: geoInfo.country || '',
            admin1: geoInfo.admin1 || '',
          });
        } catch (err) {
          console.error('Unable to resolve current location:', err);
          setError(err.message || 'Unable to find your current location.');
        } finally {
          setIsGeoLoading(false);
        }
      },
      (err) => {
        setIsGeoLoading(false);
        setError('Location access denied. Please grant permission or search manually.');
        console.warn(err);
      },
      { timeout: 8000 }
    );
  };

  const condition = weatherData?.current
    ? getWeatherCondition(weatherData.current.weather_code, weatherData.current.is_day)
    : getWeatherCondition(0, 1);

  return (
    <div className="weather-app-shell min-h-screen text-slate-800 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-6 sm:space-y-7 flex-1">
        <header className="weather-glass-panel flex items-center justify-between gap-4 rounded-2xl px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-none">
                SkyCast
              </h1>
              <span className="mt-1 block text-[11px] text-slate-500 font-medium">
                Your live weather dashboard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-white/80 bg-white/55 p-1 shadow-inner">
              {['C', 'F'].map((temperatureUnit) => (
                <button
                  key={temperatureUnit}
                  onClick={() => setUnit(temperatureUnit)}
                  aria-label={`Show temperature in °${temperatureUnit}`}
                  aria-pressed={unit === temperatureUnit}
                  className={`min-w-9 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                    unit === temperatureUnit
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-500 hover:bg-white/60 hover:text-slate-900'
                  }`}
                >
                  °{temperatureUnit}
                </button>
              ))}
            </div>
            <button
              onClick={() => void fetchWeather(selectedCity, true)}
              disabled={refreshing || loading || !selectedCity}
              title="Refresh live data"
              aria-label="Refresh weather"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/80 bg-white/60 text-slate-600 shadow-sm transition hover:bg-white hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </div>
        </header>

        <SearchBar
          onSelectCity={setSelectedCity}
          onUseCurrentLocation={handleUseCurrentLocation}
          isGeoLoading={isGeoLoading}
        />

        {error && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-200/80 bg-rose-50/90 p-4 text-sm text-rose-800 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => void fetchWeather(selectedCity)}
              className="text-xs font-semibold text-rose-700 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="weather-glass-panel flex min-h-56 flex-col items-center justify-center gap-3 rounded-3xl">
            <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
            <span className="text-xs text-slate-500 font-medium">
              Detecting location and fetching live weather...
            </span>
          </div>
        ) : weatherData && selectedCity ? (
          <main className="space-y-5">
            <CurrentWeather
              weather={weatherData}
              city={selectedCity}
              condition={condition}
              unit={unit}
              convertTemp={convertTemp}
              lastUpdated={lastUpdated}
            />
            <HourlyForecast
              hourly={weatherData.hourly}
              convertTemp={convertTemp}
            />
            <DailyForecast
              daily={weatherData.daily}
              convertTemp={convertTemp}
            />
          </main>
        ) : null}
      </div>

      <footer className="px-4 py-6 text-center text-xs text-slate-500">
        <p>Weather forecasts powered by <span className="font-semibold text-slate-600">Open-Meteo</span></p>
      </footer>
    </div>
  );
}
