import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function SignUpCompleteScreen() {
  const router = useRouter();
  const { nickname } = useLocalSearchParams<{ nickname?: string }>();

  useEffect(() => {
    // 회원가입 완료 즉시 홈화면으로 이동
    router.replace('/(tabs)');
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.completeText}>회원가입 완료</Text>
      <Text style={styles.welcomeText}>
        {nickname ? `${nickname}님\n반가워요!` : '반가워요!'}
      </Text>
      <Text style={styles.infoText}>홈으로 이동 중...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 100,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 100,
    marginBottom: 24,
  },
  completeText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#888',
  },
});
