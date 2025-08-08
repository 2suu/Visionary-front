import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSignUpStore } from '../stores/useSignUpStore'; //Zustand import

export default function SignUpIdScreen() {
  const [userId, setUserId] = useState('');
  const router = useRouter();
  const { nickname, setField } = useSignUpStore(); //Zustand 값 가져오기

  useEffect(() => {
    if (!nickname) {
      Alert.alert('잘못된 접근', '닉네임이 없습니다.');
      router.replace('/signup-nickname'); // 뒤로 보내기
    }
  }, []);

  const handleConfirm = () => {
    if (!userId.trim()) {
      Alert.alert('알림', '아이디를 입력해주세요!');
      return;
    }

    // Zustand에 아이디 저장
    setField('userId', userId);

    //다음 화면으로 이동
    router.push('/signup-password');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#333" />
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
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>다음</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'SUIT-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'SUIT-Regular',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingVertical: 12,
    marginBottom: 32,
    fontFamily: 'SUIT-Regular',
  },
  button: {
    backgroundColor: '#4E41FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'SUIT-Bold',
  },
});
