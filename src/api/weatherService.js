import { weatherApi, geoApi } from './axiosInstance';
import axios from 'axios';

export const searchCity = async (cityName, count = 5) => {
  if (!cityName || cityName.trim() === '') return [];
  const data = await geoApi.get('/search', {
    params: {
      name: cityName.trim(),
      count,
      language: 'en',
      format: 'json',
    },
  });
  return data.results || [];
};

export const getUserLocationByIP = async () => {
  try {
    const res = await axios.get('https://ipwho.is/', { timeout: 5000 });
    if (res.data && res.data.success !== false) {
      return {
        name: res.data.city || 'My Location',
        latitude: res.data.latitude,
        longitude: res.data.longitude,
        country: res.data.country || 'Pakistan',
        admin1: res.data.region || '',
      };
    }
  } catch (err) {
    console.warn('IP location fallback failed:', err.message);
  }
  return null;
};

export const reverseGeocode = async (latitude, longitude) => {
  try {
    const res = await axios.get(
      'https://api.bigdatacloud.net/data/reverse-geocode-client',
      {
        params: {
          latitude,
          longitude,
          localityLanguage: 'en',
        },
        timeout: 5000,
      }
    );
    if (res.data) {
      const city =
        res.data.city ||
        res.data.locality ||
        res.data.principalSubdivision ||
        'My Location';
      const admin1 = res.data.principalSubdivision || '';
      const country = res.data.countryName || '';
      return { name: city, admin1, country };
    }
  } catch (err) {
    console.warn('Reverse geocoding failed:', err.message);
  }
  return { name: 'Current Location', admin1: '', country: '' };
};

export const getWeatherData = (latitude, longitude) => {
  return weatherApi.get('/forecast', {
    params: {
      latitude,
      longitude,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'weather_code',
        'wind_speed_10m',
        'surface_pressure',
      ].join(','),
      hourly: ['temperature_2m', 'weather_code'].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'sunrise',
        'sunset',
        'precipitation_probability_max',
      ].join(','),
      timezone: 'auto',
    },
  });
};
