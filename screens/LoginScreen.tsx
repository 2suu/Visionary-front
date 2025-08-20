import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from './auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, loading } = useAuth();
  const insets = useSafeAreaInsets();

  // ✅ 키 이름을 서버/컨텍스트와 일치: id
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const canSubmit = useMemo(
    () => id.trim().length > 0 && password.trim().length > 0 && !loading,
    [id, password, loading]
  );

  const handleLogin = async () => {
    if (!canSubmit) {
      console.log('[LOGIN][UI] blocked submit (invalid state)');
      return;
    }
    console.log('[LOGIN][UI] try signIn =>', { id: id.trim(), remember });

    try {
      await signIn({ id:id.trim() , password: password.trim(), remember }); // 실패 시 throw됨
      console.log('[LOGIN][UI] signIn success → navigate home');
      router.replace('/(tabs)/home'); // ✅ 성공시에만 이동
    } catch (e: any) {
      console.warn('[LOGIN][UI] signIn failed =>', e?.message);
      Alert.alert('로그인 실패', e?.message ?? '잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.top}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 16 }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        bounces={false}
      >
        <View style={styles.container}>
          <Text style={styles.logo}>VISIONARY</Text>

          <View style={styles.centerWrap}>
            <View style={styles.centerArea}>
              <TextInput
                placeholder="아이디"
                style={styles.input}
                value={id}
                onChangeText={setId}
                placeholderTextColor="#aaa"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                textContentType="username"
              />
              <TextInput
                placeholder="비밀번호"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#aaa"
                returnKeyType="done"
                editable={!loading}
                textContentType="password"
                onSubmitEditing={handleLogin}
              />

              <Text style={styles.or}>or</Text>

              <View style={styles.socialRow}>
                <TouchableOpacity onPress={() => {}} disabled={loading} style={styles.socialShadow}>
                  <Image source={require('../assets/images/google.png')} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {}} disabled={loading} style={styles.socialShadow}>
                  <Image source={require('../assets/images/naver.png')} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {}} disabled={loading} style={styles.socialShadow}>
                  <Image source={require('../assets/images/kakao.png')} style={styles.icon} />
                </TouchableOpacity>
              </View>

              <View style={styles.linkRowContainer}>
                <TouchableOpacity onPress={() => router.push('/find-id')} disabled={loading}>
                  <Text style={styles.linkText}>아이디 찾기</Text>
                </TouchableOpacity>
                <Text style={styles.separator}>|</Text>
                <TouchableOpacity onPress={() => router.push('/find-password')} disabled={loading}>
                  <Text style={styles.linkText}>비밀번호 찾기</Text>
                </TouchableOpacity>
                <Text style={styles.separator}>|</Text>
                <TouchableOpacity onPress={() => router.push('/signup-verify')} disabled={loading}>
                  <Text style={styles.linkText}>회원가입</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.bottomArea}>
            <View style={styles.rememberRow}>
              <Switch
                value={remember}
                onValueChange={setRemember}
                thumbColor={remember ? '#4F46E5' : '#ccc'}
                ios_backgroundColor="#D1D5DB"
                trackColor={{ false: '#D1D5DB', true: '#D1D5DB' }}
                disabled={loading}
              />
              <Text style={styles.rememberText}>로그인 상태 유지</Text>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, (!canSubmit || loading) && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={!canSubmit}
              activeOpacity={0.9}
            >
              <Text style={styles.loginButtonText}>{loading ? '로그인 중…' : '로그인'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const LINE = '#E5E7EB';

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  container: { flex: 1, alignItems: 'center' },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginTop: 200,
    marginBottom: 0,
  },
  centerWrap: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerArea: {
    width: '100%',
    maxWidth: 440,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1.2,
    borderBottomColor: LINE,
    marginBottom: 18,
    fontSize: 16,
    paddingVertical: 10,
  },
  or: {
    marginTop: 12,
    marginBottom: 12,
    color: '#9CA3AF',
    fontSize: 13,
    textAlign: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  socialShadow: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  icon: { width: 44, height: 44, resizeMode: 'contain' },
  linkRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  linkText: { fontSize: 12, color: '#888', marginHorizontal: 4 },
  separator: { fontSize: 12, color: '#888' },
  bottomArea: {
    width: '100%',
    maxWidth: 440,
    transform: [{ translateY: -25 }],
    paddingBottom: 8,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 14,
    width: '100%',
    maxWidth: 440,
  },
  rememberText: { marginLeft: 8, fontSize: 14, color: '#444' },
  loginButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.2 },
});