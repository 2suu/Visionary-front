import { create } from 'zustand';

interface SignUpState {
  name: string;
  rrn: string;
  tel: string;
  carrier: string;
  nickname: string;
  userId: string;
  password: string;
  setField: (field: keyof SignUpState, value: string) => void;
  reset: () => void;
}

export const useSignUpStore = create<SignUpState>((set) => ({
  name: '',
  rrn: '',
  tel: '',
  carrier: '',
  nickname: '',
  userId: '',
  password: '',
  setField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),
  reset: () =>
    set({
      name: '',
      rrn: '',
      tel: '',
      carrier: '',
      nickname: '',
      userId: '',
      password: '',
      setField: () => {},
      reset: () => {},
    }),
}));