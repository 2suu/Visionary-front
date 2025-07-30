// stores/auth.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthState = {
  token: string | null;
  isLoggedIn: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoggedIn: false,

  login: async (token) => {
    await AsyncStorage.setItem('authToken', token);
    set({ token, isLoggedIn: true });
  },

  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    set({ token: null, isLoggedIn: false });
  },

  restoreToken: async () => {
    const storedToken = await AsyncStorage.getItem('authToken');
    if (storedToken) {
      set({ token: storedToken, isLoggedIn: true });
    }
  },
}));