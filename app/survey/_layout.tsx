import { Stack } from 'expo-router';
import React from 'react';
import { SurveyProvider } from '../../screens/survey/survey-context';

export default function SurveyLayout() {
  return (
    <SurveyProvider>
      <Stack screenOptions={{ headerTitleAlign: 'center', headerShadowVisible: false }}>
        <Stack.Screen name="intro" options={{ headerShown: false }} />
        <Stack.Screen name="q/[no]" options={{ headerShown: false }} />
        <Stack.Screen name="q/45" options={{ headerShown: false }} />
        <Stack.Screen name="q/46" options={{ headerShown: false }} />
        <Stack.Screen name="q/47" options={{ headerShown: false }} />
        <Stack.Screen name="confirm" options={{ headerShown: false }} />
      </Stack>
    </SurveyProvider>
  );
}
