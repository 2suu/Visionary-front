import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

const SignUpNicknameScreen: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const router = useRouter();

  const handleConfirm = () => {
    if (!nickname.trim()) {
      Alert.alert('알림', '닉네임을 입력해주세요!');
      return;
    }

    console.log('입력된 닉네임:', nickname);
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
        <Ionicons name="chevron-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.title}>안녕하세요!</Text>
        <Text style={styles.subtitle}>사용할 닉네임을 알려주세요</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="닉네임"
        placeholderTextColor="#aaa"
        value={nickname}
        onChangeText={setNickname}
      />

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default SignUpNicknameScreen;

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
    fontFamily: 'SUIT-Bold', // SUIT 폰트 적용
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
