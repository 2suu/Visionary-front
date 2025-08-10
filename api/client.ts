// api/client.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Config from 'react-native-config';

const api = axios.create({
  baseURL: Config.API_URL,
  timeout: 15000,
  headers: { 'X-Client': Config.CLIENT_TYPE || 'mobile' },
});

api.interceptors.request.use(async (config) => {
  const access = await SecureStore.getItemAsync('accessToken');
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

let isRefreshing = false;
let queue: ((t?: string)=>void)[] = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      if (isRefreshing) {
        await new Promise<void>(resolve => queue.push(() => resolve()));
        const newAccess = await SecureStore.getItemAsync('accessToken');
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      }
      isRefreshing = true;
      try {
        const refresh = await SecureStore.getItemAsync('refreshToken');
        const { data } = await axios.post(`${Config.API_URL}/auth/reissue`, { refreshToken: refresh }, {
          headers: { 'X-Client': 'mobile' }
        });
        await SecureStore.setItemAsync('accessToken', data.accessToken);
        queue.forEach(fn => fn?.(data.accessToken)); queue = [];
        return api(original);
      } catch (e) {
        queue.forEach(fn => fn?.()); queue = [];
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        // TODO: 네비게이션으로 로그인 화면 이동
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
