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
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpIdScreen() {
  const [userId, setUserId] = useState('');
  const router = useRouter();
  const { nickname } = useGlobalSearchParams<{ nickname?: string }>();

  useEffect(() => {
    if (!nickname) {
      Alert.alert('잘못된 접근', '닉네임 정보가 없습니다.');
      router.replace('/signup');
    }
  }, [nickname]);

  const handleConfirm = () => {
    if (!userId.trim()) {
      Alert.alert('알림', '아이디를 입력해주세요!');
      return;
    }

    console.log('닉네임:', nickname);
    console.log('아이디:', userId);

    // ✅ 비밀번호 입력 화면으로 이동
    router.push({
      pathname: '/signup-password',
      params: { nickname, userId },
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
        <Text style={styles.title}>좋아요!</Text>
        <Text style={styles.subtitle}>이제 사용할 아이디를 정해주세요</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={userId}
        onChangeText={setUserId}
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
