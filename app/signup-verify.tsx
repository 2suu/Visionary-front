import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpVerifyScreen() {
  const router = useRouter();
  const { nickname, userId, password } = useLocalSearchParams<{
    nickname?: string;
    userId?: string;
    password?: string;
  }>();

  const [name, setName] = useState('');
  const [rrn, setRrn] = useState('');
  const [tel, setTel] = useState('');

  useEffect(() => {
    if (!nickname || !userId || !password) {
      Alert.alert('잘못된 접근', '이전 단계 정보가 없습니다.');
      router.replace('/signup');
    }
  }, []);

  const handleNext = () => {
    if (!name || rrn.length !== 8 || !tel.match(/^\d{3}-\d{4}-\d{4}$/)) {
      Alert.alert('입력 오류', '이름, 주민등록번호(7자리), 휴대전화번호를 올바르게 입력해주세요.');
      return;
    }

    router.push({
      pathname: '/signup-verify-code',
      params: { nickname, userId, password, name, rrn, tel },
    });
  };

  const formatRRN = (text: string) => {
    const onlyNums = text.replace(/\D/g, '').slice(0, 7);
    if (onlyNums.length <= 6) return onlyNums;
    return `${onlyNums.slice(0, 6)}-${onlyNums[6]}`;
  };

  const formatPhone = (text: string) => {
    const nums = text.replace(/\D/g, '').slice(0, 11);
    if (nums.length < 4) return nums;
    if (nums.length < 8) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>본인확인</Text>
      <Text style={styles.subtitle}>이름, 주민등록번호, 번호를 입력해주세요</Text>

      <TextInput
        placeholder="이름"
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="주민등록번호 (예: 990101-1)"
        value={rrn}
        onChangeText={(t) => setRrn(formatRRN(t))}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="전화번호 (예: 010-1234-5678)"
        value={tel}
        onChangeText={(t) => setTel(formatPhone(t))}
        keyboardType="phone-pad"
        style={styles.input}
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>인증번호 받기</Text>
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
    paddingVertical: 10,
    marginBottom: 24,
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