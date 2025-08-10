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
      <Stack.Screen name="experience" options={{ headerShown: false }} />
      <Stack.Screen name="experience-detail" options={{ headerShown: false }} />
      <Stack.Screen name="economy-saving" options={{ headerShown: false }} />
      <Stack.Screen name="economy-spending" options={{ headerShown: false }} />
      <Stack.Screen name="relationship" options={{ headerShown: false }} />
      <Stack.Screen name="mood" options={{ headerShown: false }} />
      <Stack.Screen name="stress" options={{ headerShown: false }} />
      <Stack.Screen name="confirm" options={{ headerShown: false }} />
    </Stack>
  );
}