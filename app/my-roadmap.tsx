import MyRoadmapScreen from '@/screens/MyRoadmapScreen';
import React from 'react';

// If you want to hide the header for just this page, set it in app/_layout.tsx like:
// <Stack>
// <Stack.Screen name="roadmaps" options={{ headerShown: false }} />
// </Stack>


export default function MyRoadmapsPage() {
return <MyRoadmapScreen />;
}