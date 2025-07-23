import { useState } from 'react';
import { View } from 'react-native';
import LoginScreen from '../../screens/LoginScreen';
import HomeScreen from '../(tabs)/index'; // 기존 홈 화면 불러오기

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {isLoggedIn ? (
        <HomeScreen />
      ) : (
        <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </View>
  );
}
