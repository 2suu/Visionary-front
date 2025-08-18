// screens/SignUpNicknameScreen.tsx
// ⚙️ 개발 단계: 서버 없이 모의 응답 사용
const USE_MOCK = true;

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSignUp } from './signup-context'; // Context 사용

const PRIMARY = '#4E41FF';
const INSET = 40;

const SignUpNicknameScreen: React.FC = () => {
  const router = useRouter();
  const { setField } = useSignUp();

  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const checkNickname = async () => {
    const trimmed = nickname.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      Alert.alert('알림', '닉네임은 2~20자로 입력해주세요.');
      return;
    }

    try {
      setLoading(true);

      if (USE_MOCK) {
        const blocked = ['admin', 'test', 'manager'];
        await new Promise((r) => setTimeout(r, 500));
        const exists = blocked.includes(trimmed.toLowerCase());
        if (exists) {
          setIsAvailable(false);
          Alert.alert('중복된 닉네임입니다', '다른 닉네임을 입력해주세요.');
        } else {
          setIsAvailable(true);
          Alert.alert('사용 가능한 닉네임입니다.');
        }
      }

      // 🔗 실제 API 연동은 나중에
      /*
      const res = await api.post<{ exists: boolean }>('/api/auth/nickname/exists', { nickname: trimmed });
      if (res.exists) {
        setIsAvailable(false);
        Alert.alert('중복된 닉네임입니다', '다른 닉네임을 입력해주세요.');
      } else {
        setIsAvailable(true);
        Alert.alert('사용 가능한 닉네임입니다.');
      }
      */
    } catch (e) {
      console.error(e);
      setIsAvailable(null);
      Alert.alert('오류', '닉네임 확인 중 문제가 발생했어요.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (isAvailable !== true) {
      Alert.alert('알림', '닉네임 중복확인을 해주세요.');
      return;
    }
    setField('nickname', nickname.trim());
    router.push('/signup-id');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <View style={styles.content}>

              {/* ⬇️ 타이틀 — QuestionWrapper 스타일 */}
              <Text style={styles.title} allowFontScaling={false}>닉네임</Text>
              <Text style={styles.sub} allowFontScaling={false}>
                사용할 닉네임을 2~20자로 정해주세요
              </Text>

              {/* 입력 + 중복확인 */}
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="닉네임 (2~20자)"
                  placeholderTextColor="#aaa"
                  value={nickname}
                  onChangeText={(t) => {
                    setNickname(t);
                    setIsAvailable(null);
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={20}
                />
                <TouchableOpacity
                  style={[styles.checkButton, loading && { opacity: 0.6 }]}
                  onPress={checkNickname}
                  disabled={loading}
                >
                  <Text style={styles.checkButtonText}>
                    {loading ? '확인중...' : '중복확인'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 상태 메시지 */}
              {isAvailable === false && <Text style={styles.error}>이미 사용 중인 닉네임입니다.</Text>}
              {isAvailable === true && <Text style={styles.success}>사용 가능한 닉네임입니다.</Text>}
            </View>
          </ScrollView>

          {/* ⬇️ CTA 버튼 — QuestionWrapper cta */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.95}
              style={[styles.cta, (isAvailable !== true || loading) && styles.ctaDisabled]}
              onPress={handleNext}
              disabled={isAvailable !== true || loading}
            >
              <Text style={styles.ctaText} allowFontScaling={false}>다음</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpNicknameScreen;

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, backgroundColor: '#fff' },
  content: { paddingTop: 72, paddingHorizontal: INSET, paddingBottom: 24 },

  backButton: { marginBottom: 20 },

  // 타이틀
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111',
    textAlign: 'left',
    lineHeight: 26,
    marginBottom: 6,
  },
  sub: { fontSize: 15, color: '#6A6A76', marginBottom: 20 },

  // 입력 + 버튼
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingVertical: 12,
    fontFamily: 'SUIT-Regular',
    color: '#111',
  },
  checkButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  checkButtonText: { color: '#fff', fontSize: 14, fontFamily: 'SUIT-Bold' },

  error: { color: '#E5484D', fontSize: 13, marginTop: 6 },
  success: { color: PRIMARY, fontSize: 13, marginTop: 6 },

  // CTA
  footer: { paddingVertical: 12, backgroundColor: '#fff' },
  cta: {
    alignSelf: 'center',
    width: '93%',
    height: 52,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 8,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  ctaDisabled: { opacity: 0.4 },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700', lineHeight: 16 },
});
