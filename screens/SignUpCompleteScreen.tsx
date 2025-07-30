import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SignUpCompleteScreen() {
  const { nickname } = useLocalSearchParams<{ nickname?: string }>();

  useEffect(() => {
    if (!nickname) {
      router.replace('/(tabs)/home');
    } else {
      const timeout = setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [nickname]);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.completeText}>회원가입 완료</Text>
      <Text style={styles.welcomeText}>
        {nickname ? `${nickname}님 반가워요!` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 30,
  },
  completeText: {
    fontSize: 18,
    color: '#666',
    fontFamily: 'SUIT-Regular',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4E41FF',
    fontFamily: 'SUIT-Bold',
  },
});