export const getWeatherCondition = (code, isDay = 1) => {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Clear Sky' : 'Clear Night',
        icon: isDay ? 'Sun' : 'Moon',
        accent: 'text-amber-500',
        badge: 'bg-amber-50 text-amber-700 border-amber-200/60',
      };
    case 1:
    case 2:
      return {
        label: isDay ? 'Partly Cloudy' : 'Partly Cloudy Night',
        icon: isDay ? 'CloudSun' : 'CloudMoon',
        accent: 'text-sky-600',
        badge: 'bg-sky-50 text-sky-700 border-sky-200/60',
      };
    case 3:
      return {
        label: 'Overcast',
        icon: 'Cloud',
        accent: 'text-slate-600',
        badge: 'bg-slate-100 text-slate-700 border-slate-200',
      };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        icon: 'CloudFog',
        accent: 'text-zinc-600',
        badge: 'bg-zinc-100 text-zinc-700 border-zinc-200',
      };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return {
        label: 'Drizzle',
        icon: 'CloudDrizzle',
        accent: 'text-teal-600',
        badge: 'bg-teal-50 text-teal-700 border-teal-200/60',
      };
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain',
        icon: 'CloudRain',
        accent: 'text-blue-600',
        badge: 'bg-blue-50 text-blue-700 border-blue-200/60',
      };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return {
        label: 'Snow',
        icon: 'CloudSnow',
        accent: 'text-cyan-600',
        badge: 'bg-cyan-50 text-cyan-700 border-cyan-200/60',
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Thunderstorm',
        icon: 'CloudLightning',
        accent: 'text-indigo-600',
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
      };
    default:
      return {
        label: 'Clear',
        icon: 'Sun',
        accent: 'text-amber-500',
        badge: 'bg-amber-50 text-amber-700 border-amber-200/60',
      };
  }
};
