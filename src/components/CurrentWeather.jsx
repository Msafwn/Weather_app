import { useState, useEffect } from 'react';
import WeatherIcon from './WeatherIcon';
import {
  Wind,
  Droplets,
  Thermometer,
  Gauge,
  Sunrise,
  Sunset,
  ArrowUp,
  ArrowDown,
  Clock,
} from 'lucide-react';

export default function CurrentWeather({
  weather,
  city,
  condition,
  unit,
  convertTemp,
  lastUpdated,
}) {
  const current = weather.current;
  const daily = weather.daily;

  // Real-time live digital clock
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  const todaySunrise = daily?.sunrise?.[0] ? formatTime(daily.sunrise[0]) : null;
  const todaySunset = daily?.sunset?.[0] ? formatTime(daily.sunset[0]) : null;
  const todayMax = daily?.temperature_2m_max?.[0];
  const todayMin = daily?.temperature_2m_min?.[0];

  const metrics = [
    {
      label: 'Feels Like',
      value: `${convertTemp(current.apparent_temperature)}°${unit}`,
      icon: Thermometer,
      iconColor: 'text-rose-500',
      bgColor: 'bg-rose-50',
    },
    {
      label: 'Humidity',
      value: `${current.relative_humidity_2m}%`,
      icon: Droplets,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Wind Speed',
      value: `${current.wind_speed_10m} km/h`,
      icon: Wind,
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      label: 'Pressure',
      value: `${Math.round(current.surface_pressure || 1013)} hPa`,
      icon: Gauge,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      label: 'Sunrise',
      value: todaySunrise || '06:00 AM',
      icon: Sunrise,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Sunset',
      value: todaySunset || '06:30 PM',
      icon: Sunset,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Main Weather Card */}
      <div className="weather-glass-card rounded-3xl p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
          {/* Left Info */}
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {/* Live Status Badge with pulsing green dot */}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>

              {/* Weather Condition Badge */}
              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${condition.badge}`}>
                {condition.label}
              </span>

              {/* Real-time Clock */}
              <span className="ml-1 inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                <Clock className="w-3 h-3 text-slate-400" />
                {liveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {city.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {[city.admin1, city.country].filter(Boolean).join(', ')}
            </p>

            {todayMax !== undefined && (
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5 rounded-lg border border-white/80 bg-white/65 px-3 py-1.5 shadow-sm">
                  <ArrowUp className="w-3.5 h-3.5 text-rose-500" />
                  H: {convertTemp(todayMax)}°
                </span>
                <span className="flex items-center gap-1.5 rounded-lg border border-white/80 bg-white/65 px-3 py-1.5 shadow-sm">
                  <ArrowDown className="w-3.5 h-3.5 text-blue-500" />
                  L: {convertTemp(todayMin)}°
                </span>
                {lastUpdated && (
                  <span className="hidden text-[11px] font-medium text-slate-400 sm:inline">
                    Updated {lastUpdated}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right: Big Temp + Weather Icon */}
          <div className="flex items-center gap-3 rounded-3xl border border-white/70 bg-white/35 px-5 py-4 shadow-inner sm:gap-5 sm:px-7 sm:py-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/80 bg-white/70 shadow-md shadow-blue-900/5 sm:h-20 sm:w-20">
              <WeatherIcon
                name={condition.icon}
                isDay={current.is_day}
                className="h-12 w-12 sm:h-16 sm:w-16"
              />
            </div>

            <div>
              <div className="whitespace-nowrap text-6xl font-light tracking-tighter text-slate-900 sm:text-7xl">
                {convertTemp(current.temperature_2m)}
                <span className="ml-1 text-3xl font-normal tracking-tight text-slate-400">°{unit}</span>
              </div>
              <p className="mt-1 text-center text-xs font-medium text-slate-500">Current temperature</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="weather-glass-metric flex min-h-24 flex-col justify-between rounded-2xl p-3.5 transition sm:p-4"
            >
              <div className="flex items-center justify-between gap-2 text-xs font-medium text-slate-500">
                <span>{m.label}</span>
                <div className={`rounded-lg p-1.5 ${m.bgColor}`}>
                  <Icon className={`w-3.5 h-3.5 ${m.iconColor}`} />
                </div>
              </div>
              <div className="mt-2 text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                {m.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
