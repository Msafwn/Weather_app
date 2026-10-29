import axios from 'axios';


export const weatherApi = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const geoApi = axios.create({
  baseURL: 'https://geocoding-api.open-meteo.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const requestHandler = (config) => {
  return config;
};

const errorHandler = (error) => {
  const message =
    error.response?.data?.reason ||
    error.response?.data?.message ||
    error.message ||
    'Something went wrong. Please try again.';

  console.error('API Error:', message);
  return Promise.reject(new Error(message));
};


weatherApi.interceptors.request.use(requestHandler, (err) => Promise.reject(err));
weatherApi.interceptors.response.use((res) => res.data, errorHandler);

geoApi.interceptors.request.use(requestHandler, (err) => Promise.reject(err));
geoApi.interceptors.response.use((res) => res.data, errorHandler);

export default weatherApi;
