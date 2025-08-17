import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from './auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, loading } = useAuth();
  const insets = useSafeAreaInsets(); // ⬅️ 추가

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleLogin = async () => {
    try {
      await signIn({ userId, password, remember });
      router.replace('/(tabs)/home');
    } catch {}
  };

  return (
    // ⬇️ KAV를 최상단으로 올림
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.top} // ⬅️ 노치/상단바 높이만큼 오프셋
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 16 }]} // ⬅️ 하단 여유
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag" // ⬅️ 드래그로 키보드 내림
        bounces={false}
      >
        {/* ✅ 기존 내용 그대로 (내부 KeyboardAvoidingView 는 제거) */}
        <View style={styles.container}>
          <Text style={styles.logo}>VISIONARY</Text>

          <View style={styles.centerWrap}>
            <View style={styles.centerArea}>
              <TextInput
                placeholder="아이디"
                style={styles.input}
                value={userId}
                onChangeText={setUserId}
                placeholderTextColor="#aaa"
                returnKeyType="next"
                autoCapitalize="none"
                editable={!loading}
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
              style={[styles.loginButton, loading && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={loading}
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
  // ScrollView 내부 컨텐츠 스타일
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },

  kav: { flex: 1 },

  container: {
    flex: 1,
    alignItems: 'center',
  },

  // ⬇ 제목 (VISIONARY)
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginTop: 200,
    marginBottom: 0,
  },

  // ⬇ 중앙 묶음을 '화면' 기준으로 수직/가로 중앙 고정
  centerWrap: {
    flex: 1,               // 화면 남는 공간을 채워 수직 중앙 계산
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ⬇ 아이디/비밀번호 입력칸 덩어리
  centerArea: {
    width: '100%',
    maxWidth: 440,
    // ⚠️ 여기서는 flex:1, justifyContent:'center' 제거 → centerWrap이 중앙 정렬 담당
  },

  // 입력 필드 공통 스타일
  input: {
    width: '100%',
    borderBottomWidth: 1.2,
    borderBottomColor: LINE,
    marginBottom: 18,
    fontSize: 16,
    paddingVertical: 10,
  },

  // or 텍스트
  or: {
    marginTop: 12,
    marginBottom: 12,
    color: '#9CA3AF',
    fontSize: 13,
    textAlign: 'center',
  },

  // SNS 아이콘 행
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
  icon: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },

  // 아이디/비번 찾기/회원가입 줄
  linkRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  linkText: { fontSize: 12, color: '#888', marginHorizontal: 4 },
  separator: { fontSize: 12, color: '#888' },

  // 하단 영역
  bottomArea: {
    width: '100%',
    maxWidth: 440,
    transform: [{ translateY: -25 }],
    paddingBottom: 8,
  },

  // ⬇ 가로 중앙 정렬 (세로 위치는 bottomArea가 유지)
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // 가로 중앙
    alignSelf: 'center',      // 행 자체도 중앙
    marginBottom: 14,
    width: '100%',
    maxWidth: 440,
  },
  rememberText: { marginLeft: 8, fontSize: 14, color: '#444' },

  // 로그인 버튼
  loginButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
