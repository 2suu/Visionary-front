// api/client.ts
import axios from 'axios';
import { Platform } from 'react-native';

const pickBase = () => {
  // 실기기 + adb reverse면 LOCAL을 우선
  if (__DEV__) return process.env.EXPO_PUBLIC_API_BASE_LOCAL
    ?? (Platform.OS === 'android'
          ? process.env.EXPO_PUBLIC_API_BASE_ANDROID
          : process.env.EXPO_PUBLIC_API_BASE_IOS);

  return 'https://api.example.com';
};

export const api = axios.create({
  baseURL: pickBase(),
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 공통 인터셉터(로그/에러)
api.interceptors.response.use(
  r => r,
  e => {
    console.log('[API ERROR]', e?.config?.url, e?.message, e?.response?.status, e?.response?.data);
    return Promise.reject(e);
  }
);
