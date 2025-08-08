import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useSignUpStore } from '../stores/useSignUpStore';

export default function SignUpCompleteScreen() {
  const router = useRouter();
  const {
    nickname,
    userId,
    password,
    name,
    rrn,
    tel,
    carrier,
    reset,
  } = useSignUpStore();

  useEffect(() => {
    const register = async () => {
      try {
        // ✅ API 요청
        // await axios.post('https://your-api.com/api/auth/signup', {nickname,userId, password, name, rrn, tel, carrier,});

        Alert.alert('🎉 가입 완료', `${nickname}님 환영합니다!`);

        // ✅ 2초 후 홈 이동
        setTimeout(() => {
          reset(); // 상태 초기화
          router.replace('/(tabs)/home');
        }, 2000);
      } catch (error) {
        console.error('회원가입 실패:', error);
        Alert.alert('오류', '회원가입에 실패했습니다.');
        router.replace('/login');
      }
    };

    register();
  }, []);

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
