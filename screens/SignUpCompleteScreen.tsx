// screens/SignUpCompleteScreen.tsx
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSignUp } from './signup-context'; // ✅ Context로 교체 (경로 확인)

export default function SignUpCompleteScreen() {
  const router = useRouter();
  const { data, reset } = useSignUp();     // ✅ Context 사용
  const nickname = data.nickname ?? '';

  useEffect(() => {
    // 웹 Alert 콜백 이슈 피해서 그냥 자동 이동
    const t = setTimeout(() => {
      reset(); // 가입 데이터 비우기
      router.replace('/(tabs)/home');
    }, 1500);
    return () => clearTimeout(t);
  }, [reset, router]);

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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 24 },
  emoji: { fontSize: 80, marginBottom: 30 },
  completeText: { fontSize: 18, color: '#666', fontFamily: 'SUIT-Regular', marginBottom: 10 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#4E41FF', fontFamily: 'SUIT-Bold' },
});
