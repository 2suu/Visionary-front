// api/client.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE, // http://192.168.1.11:8080
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log('[API ERROR]', err?.message, err?.response?.status, err?.config?.url);
    return Promise.reject(err);
  }
);

export default api; // ✅ default export로 고정
