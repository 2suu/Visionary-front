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

export default function SignUpPasswordScreen() {
  const router = useRouter();
  const { nickname, userId } = useLocalSearchParams<{
    nickname?: string;
    userId?: string;
  }>();

  const [password, setPassword] = useState('');

  const handleNext = () => {
    if (!password.trim()) {
      Alert.alert('알림', '비밀번호를 입력해주세요!');
      return;
    }

    console.log('닉네임:', nickname);
    console.log('아이디:', userId);
    console.log('비밀번호:', password);

    // 다음 화면(본인 확인)으로 이동
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
        <Ionicons name="chevron-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.title}>마지막 단계예요!</Text>
        <Text style={styles.subtitle}>비밀번호를 설정해주세요</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
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