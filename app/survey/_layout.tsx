// app/survey/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function SurveyLayout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: 'center', headerShadowVisible: false }}>
      <Stack.Screen name="intro" options={{ headerShown: false }} />
      <Stack.Screen name="q/[no]" options={{ headerShown: false }} />
      <Stack.Screen name="q/45" options={{ headerShown: false }} />
      <Stack.Screen name="q/46" options={{ headerShown: false }} />
      <Stack.Screen name="q/47" options={{ headerShown: false }} />
      <Stack.Screen name="confirm" options={{ headerShown: false }} />
    </Stack>
  );
}
