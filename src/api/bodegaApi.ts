import axios from 'axios';

const bodegaApi = axios.create({
  baseURL: import.meta.env.VITE_BODEGA_API_URL,
});

bodegaApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { bodegaApi };
