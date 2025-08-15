// screens/signup-context.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type Carrier = 'SKT' | 'KT' | 'LGU+' | '알뜰폰';

export type SignUpData = {
  // 본인인증 단계
  name?: string;
  rrn7?: string;        // "######-#"
  carrier?: Carrier;
  phone?: string;       // "010-0000-0000"
  transactionId?: string;

  // 회원가입 단계
  nickname?: string;
  userId?: string;      // 최종 전송 시 백엔드 키는 id로 매핑
  password?: string;
  agreed?: boolean;
};

type Meta = {
  hasVerifyBase: boolean;   // transactionId 보유 등, 인증코드 화면 진입 OK
  hasNickname: boolean;     // 닉네임 단계 통과
  hasUserId: boolean;       // 아이디 단계 통과
  readyForSignup: boolean;  // nickname + userId + password 준비 완료
};

type Ctx = {
  data: SignUpData;
  setField: <K extends keyof SignUpData>(key: K, value: SignUpData[K]) => void;
  setMany: (patch: Partial<SignUpData>) => void;
  reset: () => void;
  clear: (keys?: (keyof SignUpData)[]) => void;
  meta: Meta;

  // 유틸/검증기
  validators: {
    isNicknameValid: (s?: string) => boolean;
    isUserIdValid: (s?: string) => boolean;
    isPasswordValid: (s?: string) => boolean;
  };

  // 라우팅 가드용 (필요 시 사용)
  assert: {
    verifyBase: () => void;
    nicknameDone: () => void;
    userIdDone: () => void;
    readyForSignup: () => void;
  };
};

const SignUpContext = createContext<Ctx | null>(null);

// --- 재사용 가능한 검증 로직 ---
const isNicknameValid = (s?: string) => !!(s && s.trim().length >= 2 && s.trim().length <= 20);
const isUserIdValid   = (s?: string) => !!(s && s.trim().length >= 4 && s.trim().length <= 20);
const isPasswordValid = (s?: string) => !!(s && s.length >= 8);

export function SignUpProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SignUpData>({});

  // 같은 값이면 업데이트 스킵 → 리렌더 감소
  const setField = useCallback(<K extends keyof SignUpData>(key: K, value: SignUpData[K]) => {
    setData(prev => {
      const prevVal = prev[key];
      if (prevVal === value) return prev; // no-op
      return { ...prev, [key]: value };
    });
  }, []);

  const setMany = useCallback((patch: Partial<SignUpData>) => {
    setData(prev => {
      // 값이 실제로 바뀌지 않으면 같은 레퍼런스 반환
      let changed = false;
      const next: SignUpData = { ...prev };
      (Object.keys(patch) as (keyof SignUpData)[]).forEach(k => {
        if (next[k] !== patch[k]) {
          changed = true;
          next[k] = patch[k] as any;
        }
      });
      return changed ? next : prev;
    });
  }, []);

  const reset = useCallback(() => setData({}), []);
  const clear = useCallback((keys?: (keyof SignUpData)[]) => {
    const defaultKeys: (keyof SignUpData)[] = ['password'];
    const toClear = keys?.length ? keys : defaultKeys;

    setData(prev => {
      let changed = false;
      const next: SignUpData = { ...prev };
      toClear.forEach(k => {
        if (k in next) {
          changed = true;
          delete next[k];
        }
      });
      return changed ? next : prev;
    });
  }, []);

  // trim 한 값 재사용 (meta 계산/검증 일원화)
  const nicknameTrimmed = useMemo(() => data.nickname?.trim() ?? '', [data.nickname]);
  const userIdTrimmed   = useMemo(() => data.userId?.trim() ?? '',   [data.userId]);

  const meta = useMemo<Meta>(() => {
    const hasVerifyBase = !!data.transactionId;
    const hasNickname = isNicknameValid(nicknameTrimmed);
    const hasUserId   = isUserIdValid(userIdTrimmed);
    const readyForSignup = !!(hasNickname && hasUserId && isPasswordValid(data.password));
    return { hasVerifyBase, hasNickname, hasUserId, readyForSignup };
  }, [data.transactionId, data.password, nicknameTrimmed, userIdTrimmed]);

  const validators = useMemo(() => ({
    isNicknameValid,
    isUserIdValid,
    isPasswordValid,
  }), []);

  // 필요 시 화면 진입 전에 호출해서 막기
  const assert = useMemo(() => ({
    verifyBase: () => {
      if (!meta.hasVerifyBase) throw new Error('본인인증 정보가 없습니다.');
    },
    nicknameDone: () => {
      if (!meta.hasNickname) throw new Error('닉네임 단계가 완료되지 않았습니다.');
    },
    userIdDone: () => {
      if (!meta.hasUserId) throw new Error('아이디 단계가 완료되지 않았습니다.');
    },
    readyForSignup: () => {
      if (!meta.readyForSignup) throw new Error('회원가입 입력이 완료되지 않았습니다.');
    },
  }), [meta]);

  const value = useMemo<Ctx>(() => ({
    data,
    setField,
    setMany,
    reset,
    clear,
    meta,
    validators,
    assert,
  }), [data, setField, setMany, reset, clear, meta, validators, assert]);

  return (
    <SignUpContext.Provider value={value}>
      {children}
    </SignUpContext.Provider>
  );
}

export const useSignUp = () => {
  const ctx = useContext(SignUpContext);
  if (!ctx) throw new Error('useSignUp must be used within SignUpProvider');
  return ctx;
};

// 선택: 특정 필드만 구독하고 싶을 때(리렌더 최소화)
// 사용예) const nickname = useSignUpSelector(s => s.data.nickname);
export function useSignUpSelector<T>(selector: (ctx: Ctx) => T): T {
  const ctx = useSignUp();
  // 간단 버전: memo 없이 바로 반환
  return selector(ctx);
}
