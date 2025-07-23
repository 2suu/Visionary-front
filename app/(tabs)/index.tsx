// app/index.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoginScreen from '../../screens/LoginScreen';
import HomeScreen from '../(tabs)/index';

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <HomeScreen />
      ) : (
        <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
