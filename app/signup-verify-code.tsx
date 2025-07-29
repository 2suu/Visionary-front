import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function SignUpVerifyCodeScreen() {
  const router = useRouter();
  const { nickname, userId, password, name, rrn, tel } = useLocalSearchParams<{
    nickname?: string;
    userId?: string;
    password?: string;
    name?: string;
    rrn?: string;
    tel?: string;
  }>();

  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(180); // 3분
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!nickname || !userId || !password || !name || !rrn || !tel) {
      Alert.alert('잘못된 접근', '이전 단계 정보가 없습니다.');
      router.replace('/signup');
    }
  }, []);

 useEffect(() => {
  const interval = setInterval(() => {
    setTimer((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        setExpired(true);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, []);


  const formatTime = () => {
    const m = String(Math.floor(timer / 60)).padStart(2, '0');
    const s = String(timer % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

const handleVerify = () => {
  if (!code) {
    Alert.alert('오류', '인증번호를 입력해주세요.');
    return;
  }

  if (expired) {
    Alert.alert('시간 초과', '인증 시간이 초과되었습니다.');
    return;
  }

  // TODO: 서버에 인증번호 확인 요청

  Alert.alert('성공', '인증이 완료되었습니다.');
  router.push({
    pathname: '/signup-agree',
    params: {
      nickname,
      userId,
      password,
      name,
      rrn,
      tel,
    },
  });
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>인증번호 확인</Text>
      <Text style={styles.subtitle}>3분 내로 받은 인증번호를 입력해주세요</Text>

      <TextInput
        placeholder="인증번호"
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
        style={styles.input}
        placeholderTextColor="#aaa"
      />

      <Text style={styles.timerText}>
        남은 시간: {expired ? '시간 초과' : formatTime()}
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    fontSize: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 14,
    color: '#f00',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});