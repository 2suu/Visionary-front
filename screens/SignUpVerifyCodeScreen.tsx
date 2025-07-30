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
  const [timer, setTimer] = useState(180);
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
    if (!code.trim()) {
      Alert.alert('오류', '인증번호를 입력해주세요.');
      return;
    }

    if (expired) {
      Alert.alert('시간 초과', '인증 시간이 초과되었습니다.');
      return;
    }

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
        <Ionicons name="chevron-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>인증번호 확인</Text>
      <Text style={styles.subtitle}>3분 내로 받은 인증번호를 입력해주세요</Text>

      <TextInput
        placeholder="인증번호 (4자리)"
        maxLength={4}
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
    fontFamily: 'SUIT-Bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'SUIT-Regular',
    color: '#666',
    marginBottom: 24,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 20,
    paddingVertical: 12,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'SUIT-Regular',
  },
  timerText: {
    fontSize: 14,
    color: '#FF3B30',
    fontFamily: 'SUIT-Regular',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4E41FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SUIT-Bold',
  },
});