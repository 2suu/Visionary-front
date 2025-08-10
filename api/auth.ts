// api/auth.ts
import axios from 'axios';
import { Platform } from 'react-native';

const host = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
const BASE_URL = __DEV__ ? `http://${host}:8080` : 'https://api.example.com';

type SignUpBody = {
  id: string;
  password: string;
  nickname: string;
};

type RequestVerificationBody = {
  name: string;
  phoneNumber: string;
  carrier: string;
  idntificationNumber: string;
};

export async function signUp(body: SignUpBody) {
  const res = await axios.post(`${BASE_URL}/api/auth/signup`, body, {
    timeout: 8000,
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
}

export async function requestVerification(body: RequestVerificationBody) {
  console.log('[/api/auth/request] req body:', body);
  const res = await axios.post(`${BASE_URL}/api/auth/request`, body, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 8000,
  });
  console.log('[/api/auth/request] res:', res.data);
  return res.data; // { 응답코드, 응답메세지, 고유Id }
}