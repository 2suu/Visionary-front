// app/presurvey/_layout.tsx
import { Stack } from 'expo-router';

export default function PresurveyLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="intro" options={{ headerShown: false }} />
      <Stack.Screen name="age" options={{ headerShown: false }} />
      <Stack.Screen name="gender" options={{ headerShown: false  }} />
      <Stack.Screen name="education" options={{ headerShown: false }} />
    </Stack>
  );
}