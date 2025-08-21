// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../screens/auth-context';
import { SignUpProvider } from '../screens/signup-context';

// ⬇️ presurvey / survey 컨텍스트를 최상단으로 이동
import { SurveyProvider as PreSurveyProvider } from '../screens/presurvey/survey-context';
import { SurveyProvider as MainSurveyProvider } from '../screens/survey/survey-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <SignUpProvider>
          <PreSurveyProvider>
            <MainSurveyProvider>
              <Stack screenOptions={{ headerShown: false }}>
                {/* 탭 루트 및 모든 라우트는 파일 기반으로 자동 인식 */}
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </MainSurveyProvider>
          </PreSurveyProvider>
        </SignUpProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
