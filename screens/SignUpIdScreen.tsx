import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
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

export default function SignUpIdScreen() {
  const [userId, setUserId] = useState('');
  const router = useRouter();
  const { nickname } = useLocalSearchParams<{ nickname?: string }>();

  const handleConfirm = () => {
    if (!userId.trim()) {
      Alert.alert('알림', '아이디를 입력해주세요!');
      return;
    }

    console.log('닉네임:', nickname);
    console.log('아이디:', userId);

    // 다음 단계 (비밀번호 입력 화면)으로 이동
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