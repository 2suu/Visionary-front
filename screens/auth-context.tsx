// screens/auth-context.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

/** 서버 응답 필드명은 프로젝트에 맞게 매핑해서 사용 */
export type Auth = {
  userId?: string;
  accessToken?: string;
  refreshToken?: string;
  profile?: any;
};

type SignInParams = { userId: string; password: string; remember: boolean };

type Ctx = {
  auth: Auth | null;
  loading: boolean;
  signIn: (p: SignInParams) => Promise<void>;
  /** 서버에 refreshToken 전달 후 로컬 세션 정리 */
  signOut: () => Promise<void>;
  /** 필요 시 수동 세션 갱신 */
  setAuthState: (patch: Partial<Auth> | null) => Promise<void>;
};

const AuthContext = createContext<Ctx | null>(null);

const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? 'http://localhost:8080';
const STORAGE_KEY = 'visionary.auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [loading, setLoading] = useState(false);

  // 앱 시작 시 저장된 로그인 정보 불러오기(자동 로그인)
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setAuth(JSON.parse(raw) as Auth);
      } catch {
        // ignore
      }
    })();
  }, []);

  const persist = async (state: Auth | null) => {
    if (state) await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    else await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const signIn = async ({ userId, password, remember }: SignInParams) => {
    if (!userId.trim() || !password.trim()) {
      Alert.alert('로그인 실패', '아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        // ✅ 백엔드 DTO(LoginRequest): id, password
        body: JSON.stringify({ id: userId, password }),
      });

      const raw = await res.text();
      let data: any = null;
      try { data = JSON.parse(raw); } catch { /* 텍스트 메시지일 수 있음 */ }

      if (!res.ok) {
        const msg = data?.message ?? data?.error ?? raw ?? '아이디 또는 비밀번호를 확인해주세요.';
        throw new Error(msg);
      }

      const next: Auth = {
        userId,
        accessToken: data?.accessToken ?? data?.token ?? undefined,
        refreshToken: data?.refreshToken ?? undefined,
        profile: data?.user ?? data ?? undefined,
      };

      setAuth(next);
      if (remember) await persist(next);
      else await persist(null);
    } catch (e: any) {
      Alert.alert('로그인 실패', e?.message ?? '서버와 통신에 실패했습니다.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  /** 로그아웃: 서버에 refreshToken 전달(가능하면) → 로컬 세션 정리 */
  const signOut = async () => {
    const refreshToken = auth?.refreshToken;
    const accessToken = auth?.accessToken;

    try {
      if (refreshToken) {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          // ✅ 백엔드 DTO(LogoutRequest): refreshToken
          body: JSON.stringify({ refreshToken }),
        }).catch((err) => {
          // 네트워크 오류여도 로컬 세션은 정리
          console.log('[LOGOUT NET ERR]', err);
        });
      }
    } finally {
      setAuth(null);
      await persist(null);
    }
  };

  /** 필요 시 프로필/토큰 일부 갱신용 */
  const setAuthState = async (patch: Partial<Auth> | null) => {
    if (!patch) {
      setAuth(null);
      await persist(null);
      return;
    }
    setAuth(prev => {
      const next = { ...(prev ?? {}), ...patch };
      // 저장 여부는 기존 remember 로직(유저 선택)에 따라 다를 수 있음.
      // 여기서는 저장 상태 유지(이미 저장돼 있었다면 덮어쓰기).
      persist(next).catch(() => {});
      return next;
    });
  };

  const value = useMemo<Ctx>(() => ({
    auth,
    loading,
    signIn,
    signOut,
    setAuthState,
  }), [auth, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};
