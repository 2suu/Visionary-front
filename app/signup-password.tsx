import React, { useState, useEffect } from 'react';
import {
  View,
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

export default function SignUpPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const router = useRouter();
  const { nickname, userId } = useLocalSearchParams<{ nickname?: string; userId?: string }>();

  useEffect(() => {
    if (!nickname || !userId) {
      Alert.alert('잘못된 접근', '이전 단계 정보가 없습니다.');
      router.replace('/signup');
    }
  }, [nickname, userId]);

  const handleConfirm = () => {
    if (!password || !confirm) {
      Alert.alert('알림', '비밀번호를 모두 입력해주세요.');
      return;
    }

    if (password !== confirm) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }

    console.log('닉네임:', nickname);
    console.log('아이디:', userId);
    console.log('비밀번호:', password);

    // ✅ 다음 단계(본인확인)로 이동
    router.push({
      pathname: '/signup-verify',
      params: { nickname, userId, password },
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

      <View style={styles.textContainer}>
        <Text style={styles.title}>마지막 단계예요!</Text>
        <Text style={styles.subtitle}>사용할 비밀번호를 입력해주세요</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호 확인"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
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
  textContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    fontSize: 16,
    paddingVertical: 12,
    marginBottom: 32,
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