import WeatherIcon from './WeatherIcon';
import { getWeatherCondition } from '../utils/weatherCodes';
import { Clock } from 'lucide-react';

export default function HourlyForecast({ hourly, convertTemp }) {
  if (!hourly || !hourly.time || hourly.time.length === 0) return null;

  const now = new Date();
  const currentIsoHour = now.toISOString().slice(0, 13);
  let startIndex = hourly.time.findIndex((t) => t.startsWith(currentIsoHour));
  if (startIndex === -1) startIndex = 0;

  const next24 = hourly.time.slice(startIndex, startIndex + 24).map((timeStr, idx) => {
    const originalIndex = startIndex + idx;
    const date = new Date(timeStr);
    const hourLabel = date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    const isNow = idx === 0;
    const code = hourly.weather_code[originalIndex];
    const condition = getWeatherCondition(code, 1);
    const temp = hourly.temperature_2m[originalIndex];

    return {
      timeStr,
      hourLabel: isNow ? 'Now' : hourLabel,
      temp,
      condition,
      isNow,
    };
  });

  return (
    <section className="weather-glass-panel rounded-3xl p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
        <Clock className="h-4 w-4 text-blue-600" />
        <span>Hourly Forecast</span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-2">
        {next24.map((item, i) => (
          <div
            key={item.timeStr || i}
            className={`flex min-w-[68px] flex-col items-center justify-between rounded-2xl px-2 py-3 transition ${
              item.isNow
                ? 'border border-blue-200/80 bg-blue-100/80 text-blue-700 shadow-sm'
                : 'border border-white/80 bg-white/45 text-slate-700 hover:bg-white/80'
            }`}
          >
            <span
              className={`text-[11px] font-medium ${
                item.isNow ? 'text-blue-700 font-bold' : 'text-slate-500'
              }`}
            >
              {item.hourLabel}
            </span>
            <div className="my-3">
              <WeatherIcon name={item.condition.icon} className="h-6 w-6" />
            </div>
            <span
              className={`text-sm font-bold ${
                item.isNow ? 'text-blue-900' : 'text-slate-800'
              }`}
            >
              {convertTemp(item.temp)}°
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
