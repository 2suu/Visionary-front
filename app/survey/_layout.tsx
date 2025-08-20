// app/survey/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

// 이름이 겹치니 별칭으로 import
import { SurveyProvider as PreSurveyProvider } from '../../screens/presurvey/survey-context';
import { SurveyProvider as MainSurveyProvider } from '../../screens/survey/survey-context';

export default function SurveyLayout() {
  return (
    <PreSurveyProvider>
      <MainSurveyProvider>
        <Stack screenOptions={{ headerTitleAlign: 'center', headerShadowVisible: false }}>
          <Stack.Screen name="intro" options={{ headerShown: false }} />
          <Stack.Screen name="q/[no]" options={{ headerShown: false }} />
          <Stack.Screen name="q/45" options={{ headerShown: false }} />
          <Stack.Screen name="q/46" options={{ headerShown: false }} />
          <Stack.Screen name="q/47" options={{ headerShown: false }} />
          <Stack.Screen name="confirm" options={{ headerShown: false }} />
        </Stack>
      </MainSurveyProvider>
    </PreSurveyProvider>
  );
}
