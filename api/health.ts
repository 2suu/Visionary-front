// api/health.ts
import axios from 'axios';
import { Platform } from 'react-native';

const host =
  Platform.OS === 'android'
    ? '10.0.2.2'
    : '127.0.0.1';

const API = `http://localhost:8080`;

export async function ping() {
  const res = await axios.get(`${API}/actuator/health`);
  return res.data;
}

export async function checkId(id: string) {
  const res = await axios.get(`${API}/api/auth/check-id`, { params: { id } });
  return res.data;
}
