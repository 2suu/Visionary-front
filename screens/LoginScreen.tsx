import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);

  const handleLogin = () => {
    console.log('로그인 버튼 클릭!');
    router.replace('/(tabs)'); 
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.logo}>VISIONARY</Text>

        <TextInput
          placeholder="아이디"
          style={styles.input}
          value={id}
          onChangeText={setId}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="비밀번호"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#aaa"
        />

        <Text style={styles.or}>or</Text>

        <View style={styles.socialRow}>
          <TouchableOpacity onPress={() => console.log('Google 로그인')}>
            <Image source={require('../assets/images/google.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Naver 로그인')}>
            <Image source={require('../assets/images/naver.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Kakao 로그인')}>
            <Image source={require('../assets/images/kakao.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.linkRowContainer}>
          <TouchableOpacity onPress={() => router.push('/find-id')}>
            <Text style={styles.linkText}>아이디 찾기</Text>
          </TouchableOpacity>
          <Text style={styles.separator}>|</Text>
          <TouchableOpacity onPress={() => router.push('/find-password')}>
            <Text style={styles.linkText}>비밀번호 찾기</Text>
          </TouchableOpacity>
          <Text style={styles.separator}>|</Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.linkText}>회원가입</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rememberRow}>
          <Switch
            value={remember}
            onValueChange={setRemember}
            thumbColor={remember ? '#4F46E5' : '#ccc'}
          />
          <Text style={styles.rememberText}>로그인 상태 유지</Text>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#4F46E5',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    fontSize: 16,
    paddingVertical: 8,
  },
  or: {
    marginVertical: 16,
    color: '#999',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  linkRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  linkText: {
    fontSize: 12,
    color: '#888',
    marginHorizontal: 4,
  },
  separator: {
    fontSize: 12,
    color: '#888',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444',
  },
  loginButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});