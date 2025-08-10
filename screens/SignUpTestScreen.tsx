import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { signUp } from '../api/auth';

const SignUpScreen: React.FC = () => {
  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(() => {
    return nickname.trim().length >= 2 && userId.trim().length >= 4 && password.trim().length >= 6;
  }, [nickname, userId, password]);

  // ⬅ async 꼭 붙여야 함
const handleSubmit = async () => {
  console.log('📌 회원가입 버튼 클릭됨');

  if (!isValid) {
    Alert.alert('알림', '닉네임(2+), 아이디(4+), 비밀번호(6+)를 확인해주세요.');
    return;
  }

  try {
    setLoading(true);

    const body = {
      id: userId.trim(),
      password: password,
      nickname: nickname.trim(),
    };
    console.log('📦 요청 바디:', body);

    // ⬅ await는 async 함수 안에서만 가능
    const response = await signUp(body);

    console.log('✅ 서버 응답:', response);

    Alert.alert('완료', '회원가입이 성공했어요!', [
      { text: '확인', onPress: () => router.replace('/') },
    ]);
  } catch (e: any) {
    console.error('❌ 요청 실패', e?.response?.data || e.message);
  } finally {
    setLoading(false);
  }
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
        <Text style={styles.title}>회원가입</Text>
        <Text style={styles.subtitle}>닉네임, 아이디, 비밀번호를 입력해주세요</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>닉네임</Text>
        <TextInput
          style={styles.input}
          placeholder="예: rex"
          value={nickname}
          onChangeText={setNickname}
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          returnKeyType="next"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>아이디</Text>
        <TextInput
          style={styles.input}
          placeholder="예: dehu0921"
          value={userId}
          onChangeText={setUserId}
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          returnKeyType="next"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>비밀번호</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="6자 이상"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            secureTextEntry={!showPw}
            returnKeyType="done"
          />
          <TouchableOpacity onPress={() => setShowPw(v => !v)} style={styles.eyeBtn}>
            <Ionicons name={showPw ? 'eye-off' : 'eye'} size={20} color="#555" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!isValid || loading}
        activeOpacity={0.9}
      >
        {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>회원가입</Text>}
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
    marginBottom: 32,
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
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    fontSize: 16,
    paddingVertical: 12,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 36,
  },
  eyeBtn: {
    position: 'absolute',
    right: 0,
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 4,
  },
  button: {
    marginTop: 28,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
