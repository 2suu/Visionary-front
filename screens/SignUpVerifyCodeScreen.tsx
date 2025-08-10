import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSignUpStore } from '../stores/useSignUpStore'; //Zustand import

export default function SignUpVerifyCodeScreen() {
  const router = useRouter();
  const { name, rrn, tel } = useSignUpStore(); // 값 가져오기

  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(180);
  const [expired, setExpired] = useState(false);

  // 값 없으면 뒤로 보내기
  useEffect(() => {
    if (!name || !rrn || !tel) {
      Alert.alert('잘못된 접근', '이전 단계 정보가 없습니다.');
      router.replace('/signup-verify');
    }
  }, []);

  // ⏱️ 3분 타이머
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
    router.push('/signup-nickname');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <View style={styles.content}>
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
            returnKeyType="done"
            textContentType="oneTimeCode"
          />

          <Text style={styles.timerText}>
            남은 시간: {expired ? '시간 초과' : formatTime()}
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleVerify}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  kav: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
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
    color: '#000',
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
