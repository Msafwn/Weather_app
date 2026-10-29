import WeatherIcon from './WeatherIcon';
import { getWeatherCondition } from '../utils/weatherCodes';
import { Calendar, Droplets } from 'lucide-react';

export default function DailyForecast({ daily, convertTemp }) {
  if (!daily || !daily.time || daily.time.length === 0) return null;

  const days = daily.time.map((dateStr, idx) => {
    const date = new Date(dateStr + 'T00:00:00');
    const isToday = idx === 0;
    const dayName = isToday
      ? 'Today'
      : date.toLocaleDateString([], { weekday: 'short' });
    const fullDate = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

    const code = daily.weather_code[idx];
    const condition = getWeatherCondition(code, 1);
    const maxTemp = daily.temperature_2m_max[idx];
    const minTemp = daily.temperature_2m_min[idx];
    const precipProb = daily.precipitation_probability_max?.[idx] || 0;

    return {
      dateStr,
      dayName,
      fullDate,
      condition,
      maxTemp,
      minTemp,
      precipProb,
      isToday,
    };
  });

  const allMax = Math.max(...daily.temperature_2m_max);
  const allMin = Math.min(...daily.temperature_2m_min);
  const range = allMax - allMin || 1;

  return (
    <section className="weather-glass-panel rounded-3xl p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
        <Calendar className="h-4 w-4 text-blue-600" />
        <span>7-Day Forecast</span>
      </div>

      <div className="divide-y divide-white/70">
        {days.map((d, i) => {
          const leftPercent = Math.max(0, Math.min(100, ((d.minTemp - allMin) / range) * 100));
          const rightPercent = Math.max(
            0,
            Math.min(100, ((allMax - d.maxTemp) / range) * 100)
          );

          return (
            <div
              key={d.dateStr || i}
              className={`flex items-center justify-between gap-2 rounded-xl px-2 py-3 transition sm:gap-3 sm:px-3 ${
                d.isToday ? 'bg-blue-100/45' : 'hover:bg-white/45'
              }`}
            >
              {/* Day */}
              <div className="w-16 shrink-0 sm:w-24">
                <span
                  className={`text-xs font-medium ${
                    d.isToday ? 'text-blue-700 font-bold' : 'text-slate-800'
                  }`}
                >
                  {d.dayName}
                </span>
                <span className="text-[10px] text-slate-400 block">{d.fullDate}</span>
              </div>

              {/* Condition */}
              <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:w-36 sm:flex-none sm:gap-2">
                <WeatherIcon name={d.condition.icon} className="h-5 w-5 shrink-0" />
                <span className="hidden truncate text-xs text-slate-700 sm:inline">{d.condition.label}</span>
                {d.precipProb > 20 && (
                  <span className="flex items-center text-[10px] text-blue-600 font-medium">
                    <Droplets className="w-2.5 h-2.5 mr-0.5" />
                    {d.precipProb}%
                  </span>
                )}
              </div>

              {/* Min Temp */}
              <div className="w-8 shrink-0 text-right text-xs font-medium text-slate-400 sm:w-10">
                {convertTemp(d.minTemp)}°
              </div>

              {/* Progress bar */}
              <div className="relative hidden h-1.5 flex-1 overflow-hidden rounded-full bg-white/70 sm:block">
                <div
                  className="absolute bottom-0 top-0 rounded-full bg-gradient-to-r from-sky-400 to-blue-600"
                  style={{
                    left: `${leftPercent}%`,
                    right: `${rightPercent}%`,
                  }}
                />
              </div>

              {/* Max Temp */}
              <div className="w-8 shrink-0 text-right text-xs font-bold text-slate-800 sm:w-10">
                {convertTemp(d.maxTemp)}°
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
