import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SignUpScreen: React.FC = () => {
  const [nickname, setNickname] = useState<string>('');
  const router = useRouter();

  const handleConfirm = () => {
    if (!nickname.trim()) {
      Alert.alert('알림', '닉네임을 입력해주세요!');
      return;
    }

    console.log('입력된 닉네임:', nickname);

    // ✅ 다음 단계(아이디 입력)로 닉네임과 함께 이동
    router.push({
      pathname: '/signup-id',
      params: { nickname },
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
        <Text style={styles.title}>안녕하세요!</Text>
        <Text style={styles.subtitle}>사용할 닉네임을 알려주세요</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="닉네임"
        value={nickname}
        onChangeText={(text: string) => setNickname(text)}
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

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
