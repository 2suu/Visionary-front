// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../screens/auth-context';
import { SignUpProvider } from '../screens/signup-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* 로그인/세션 전역 상태 */}
      <AuthProvider>
        {/* 회원가입 진행 전역 상태 */}
        <SignUpProvider>
          <Stack screenOptions={{ headerShown: false }}>
            {/* 탭 루트 */}
            <Stack.Screen name="(tabs)" />
            {/* 로그인/회원가입/프리서베이 등 라우트는 파일명대로 자동 인식 */}
            {/* 예: app/login.tsx, app/signup-verify.tsx, app/survey/... */}
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </SignUpProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
