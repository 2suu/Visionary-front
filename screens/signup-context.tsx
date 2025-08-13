import React, { createContext, useContext, useMemo, useState } from 'react';

export type Carrier = 'SKT' | 'KT' | 'LGU+' | '알뜰폰';

export type SignUpData = {
  name?: string;
  rrn7?: string;        // "######-#"
  carrier?: Carrier;
  phone?: string;       // "010-0000-0000"
  transactionId?: string;
  nickname?: string;
  userId?: string;
  password?: string;
  agreed?: boolean;
};

type Ctx = {
  data: SignUpData;
  setField: <K extends keyof SignUpData>(key: K, value: SignUpData[K]) => void;
  reset: () => void;
};

const SignUpContext = createContext<Ctx | null>(null);

export function SignUpProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SignUpData>({});

  const api = useMemo<Ctx>(() => ({
    data,
    setField: (key, value) => setData(prev => ({ ...prev, [key]: value })),
    reset: () => setData({}),
  }), [data]);

  return <SignUpContext.Provider value={api}>{children}</SignUpContext.Provider>;
}

export const useSignUp = () => {
  const ctx = useContext(SignUpContext);
  if (!ctx) throw new Error('useSignUp must be used within SignUpProvider');
  return ctx;
};
