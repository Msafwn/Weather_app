import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
} from 'lucide-react';

export default function WeatherIcon({ name, className = 'w-6 h-6', isDay = 1 }) {
  switch (name) {
    case 'Sun':
      return <Sun className={`${className} text-amber-500 stroke-[1.8]`} />;
    case 'Moon':
      return <Moon className={`${className} text-indigo-600 stroke-[1.8]`} />;
    case 'CloudSun':
      return <CloudSun className={`${className} text-amber-500 stroke-[1.8]`} />;
    case 'CloudMoon':
      return <CloudMoon className={`${className} text-indigo-600 stroke-[1.8]`} />;
    case 'Cloud':
      return <Cloud className={`${className} text-slate-500 stroke-[1.8]`} />;
    case 'CloudFog':
      return <CloudFog className={`${className} text-slate-500 stroke-[1.8]`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={`${className} text-teal-600 stroke-[1.8]`} />;
    case 'CloudRain':
      return <CloudRain className={`${className} text-blue-600 stroke-[1.8]`} />;
    case 'CloudSnow':
      return <CloudSnow className={`${className} text-sky-500 stroke-[1.8]`} />;
    case 'CloudLightning':
      return <CloudLightning className={`${className} text-indigo-600 stroke-[1.8]`} />;
    default:
      return isDay ? (
        <Sun className={`${className} text-amber-500 stroke-[1.8]`} />
      ) : (
        <Moon className={`${className} text-indigo-600 stroke-[1.8]`} />
      );
  }
}
