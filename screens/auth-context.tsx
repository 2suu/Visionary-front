import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { Platform } from 'react-native';

// ───────────────────────────────────────────────────────────
// 타입
// ───────────────────────────────────────────────────────────
export type Auth = {
  userId?: string;
  accessToken?: string;
  refreshToken?: string;
  profile?: any;
};

// 서버 로그인 파라미터는 id 기준으로 통일
type SignInParams = { id: string; password: string; remember: boolean };

type Ctx = {
  auth: Auth | null;
  loading: boolean;
  signIn: (p: SignInParams) => Promise<void>;
  signOut: () => Promise<void>;
  setAuthState: (patch: Partial<Auth> | null) => Promise<void>;
};

const AuthContext = createContext<Ctx | null>(null);

// ───────────────────────────────────────────────────────────
// API_BASE 안전 처리 (Android 에뮬레이터 localhost 보정)
// ───────────────────────────────────────────────────────────
const RAW_BASE = (process.env.EXPO_PUBLIC_API_BASE ?? 'http://localhost:8080').replace(/\/+$/, '');
const API_BASE =
  Platform.OS === 'android' && RAW_BASE.includes('localhost')
    ? RAW_BASE.replace('localhost', '10.0.2.2')
    : RAW_BASE;

// ───────────────────────────────────────────────────────────
// 응답 파싱 유틸: JSON/텍스트 모두 안전 처리
// ───────────────────────────────────────────────────────────
async function parseRes(res: Response) {
  const ct = res.headers.get('content-type') || '';
  try {
    if (ct.includes('application/json')) {
      const json = await res.json();
      console.log('[AUTH][PARSE] JSON OK =>', json);
      return json;
    }
    const text = await res.text();
    console.log('[AUTH][PARSE] TEXT =>', text);
    return text ? { message: text } : {};
  } catch (e) {
    console.warn('[AUTH][PARSE] parse error =>', e);
    return { message: 'No body' };
  }
}

// ───────────────────────────────────────────────────────────
// Provider
// ───────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [loading, setLoading] = useState(false);

  const setAuthState = async (patch: Partial<Auth> | null) => {
    if (patch === null) {
      console.log('[AUTH][STATE] clear auth');
      await AsyncStorage.removeItem('auth');
      setAuth(null);
      return;
    }
    const next = { ...(auth ?? {}), ...patch };
    console.log('[AUTH][STATE] set auth =>', next);
    await AsyncStorage.setItem('auth', JSON.stringify(next));
    setAuth(next);
  };

  const signIn = async ({ id, password, remember }: SignInParams) => {
    setLoading(true);
    console.log('[AUTH][LOGIN] begin', { API_BASE, id, remember });

    try {
      const url = `${API_BASE}/api/auth/login`;
      console.log('[AUTH][LOGIN] POST =>', url);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });

      console.log('[AUTH][LOGIN] status =>', res.status);
      const data = await parseRes(res);

      if (!res.ok) {
        // 서버 에러 메시지를 최대한 그대로
        const msg = (data && (data.message || data.error)) || '로그인 실패';
        console.warn('[AUTH][LOGIN] fail =>', { status: res.status, msg, data });
        // ❗ 실패는 반드시 throw 해서 상위에서 탐지 가능하게
        throw new Error(`${res.status} ${msg}`);
      }

      // 성공인 경우 토큰 유효성 간단 체크(없으면 실패 처리)
      if (!data?.accessToken) {
        console.warn('[AUTH][LOGIN] success but token missing =>', data);
        throw new Error('200 but accessToken is missing');
      }

      const next: Auth = {
        userId: id,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        profile: data.profile ?? null,
      };

      // 저장 정책: remember가 true일 때만 저장 (필요에 따라 조정)
      if (remember) {
        await AsyncStorage.setItem('auth', JSON.stringify(next));
        console.log('[AUTH][LOGIN] stored (remember=true) =>', next);
      } else {
        await AsyncStorage.removeItem('auth');
        console.log('[AUTH][LOGIN] not stored (remember=false), kept in memory');
      }

      setAuth(next);
      console.log('[AUTH][LOGIN] success => setAuth done');

    } catch (e) {
      // 여기서는 Alert를 띄우지 않고, 반드시 rethrow하여 UI 계층에서 처리
      console.warn('[AUTH][LOGIN] throw to UI =>', e);
      throw e;
    } finally {
      setLoading(false);
      console.log('[AUTH][LOGIN] end (loading=false)');
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('auth');
      setAuth(null);
      console.log('[AUTH][LOGOUT] done');
    } catch (e) {
      console.warn('[AUTH][LOGOUT] error =>', e);
    }
  };

  const value = useMemo<Ctx>(() => ({ auth, loading, signIn, signOut, setAuthState }), [auth, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ───────────────────────────────────────────────────────────
// Hook
// ───────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
