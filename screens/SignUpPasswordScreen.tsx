// screens/SignUpPasswordScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
import { useSignUp } from './signup-context';

const PRIMARY = '#4E41FF';
const INSET = 40;

export default function SignUpPasswordScreen() {
  const router = useRouter();
  const { data, setField } = useSignUp();
  const { nickname, userId } = data;

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // 👁️ 비밀번호 표시/숨기기 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ 디버그/에러 상태
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastReq, setLastReq] = useState<any>(null);
  const [lastRes, setLastRes] = useState<{ status: number; body: string } | null>(null);

  // 👇 개발 중 디버그 박스 표시 토글
  const SHOW_DEBUG = true;

  // ✅ 가드: 닉네임/아이디 없으면 이전 단계로
  useEffect(() => {
    if (!nickname) {
      Alert.alert('잘못된 접근', '닉네임이 없습니다.');
      router.replace('/signup-nickname');
      return;
    }
    if (!userId) {
      Alert.alert('잘못된 접근', '아이디가 없습니다.');
      router.replace('/signup-id');
    }
  }, [nickname, userId, router]);

  const clean = (s: string) => s.replace(/\s/g, ''); // 공백 제거

  const rules = useMemo(() => {
    const pwd = clean(password);
    const lengthOK = pwd.length >= 8 && pwd.length <= 16;
    const hasLetter = /[A-Za-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(pwd);
    const isValid = lengthOK && hasLetter && hasNumber && hasSpecial;
    return { lengthOK, hasLetter, hasNumber, hasSpecial, isValid };
  }, [password]);

  const matchOK = useMemo(() => {
    const a = clean(password), b = clean(confirm);
    return b.length > 0 && a === b;
  }, [password, confirm]);

  const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? 'http://localhost:8080';

  const handleNext = async () => {
    if (loading) return;
    setErrorMsg(null);

    if (!rules.isValid || !matchOK) {
      const msg = !rules.isValid
        ? '비밀번호는 8~16자이며, 영문/숫자/특수문자를 모두 포함해야 합니다.'
        : '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
      setErrorMsg(msg);
      Alert.alert('비밀번호를 확인해주세요', msg);
      return;
    }

    try {
      setLoading(true);

      // 1) Context에 저장
      const passwordClean = clean(password);
      setField('password', passwordClean);

      // 2) Payload
      const payload = {
        id: data.userId,
        password: passwordClean,
        nickName: data.nickname,         // 서버 필드명
        transactionId: data.transactionId,
      };
      const safePayload = { ...payload, password: '********' };
      setLastReq(safePayload);
      console.log('[SIGNUP PAYLOAD]', payload);

      // 3) 요청
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      setLastRes({ status: res.status, body: text });

      if (!res.ok) {
        // 서버 메시지 파싱
        let msg = `서버 오류(${res.status})`;
        try {
          const j = JSON.parse(text);
          msg = j.message || j.error || msg;
          if (j.errors) {
            msg = j.errors.map((e: any) =>
              e.defaultMessage || e.message || `${e.field}: ${e.code}`
            ).join('\n');
          }
        } catch {
          if (text) msg = text;
        }

        // 🎯 중복 에러면 해당 화면으로 보내기
        const isIdDup = msg.includes('아이디') && (msg.includes('이미 사용') || msg.includes('중복'));
        const isNickDup = msg.includes('닉네임') && (msg.includes('이미 사용') || msg.includes('중복'));
        if (isIdDup) {
          Alert.alert('아이디 중복', msg, [
            { text: '확인', onPress: () =>
                router.replace({ pathname: '/signup-id', params: { error: msg } })
              },
          ]);
          return;
        }
        if (isNickDup) {
          Alert.alert('닉네임 중복', msg, [
            { text: '확인', onPress: () =>
                router.replace({ pathname: '/signup-nickname', params: { error: msg } })
              },
          ]);
          return;
        }

        setErrorMsg(msg);
        Alert.alert('회원가입 실패', msg);
        return;
      }

      // ✅ 성공 처리
      if (Platform.OS === 'web') {
        router.replace('/signup-complete');
      } else {
        Alert.alert('회원가입 성공', '완료 화면으로 이동합니다.', [
          { text: '확인', onPress: () => router.replace('/signup-complete') },
        ]);
      }
    } catch (err: any) {
      const msg = err?.message ?? '알 수 없는 오류';
      setErrorMsg(msg);
      Alert.alert('회원가입 실패', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={styles.kav}
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
            

              {/* ⬇️ 질문(타이틀/서브) — QuestionWrapper 스타일 */}
              <View style={styles.textContainer}>
                <Text style={styles.title} allowFontScaling={false}>비밀번호</Text>
                <Text style={styles.subtitle} allowFontScaling={false}>마지막 단계예요! 비밀번호를 설정해주세요</Text>
              </View>

              {/* 비밀번호 */}
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="비밀번호 (8~16자, 영문/숫자/특수문자 포함)"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#A3A3A3"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  textContentType="newPassword"
                />
                <TouchableOpacity onPress={() => setShowPassword(p => !p)} style={styles.eyeButton}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#666" />
                </TouchableOpacity>
              </View>

              {/* 비밀번호 확인 */}
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="비밀번호 확인"
                  secureTextEntry={!showConfirm}
                  value={confirm}
                  onChangeText={setConfirm}
                  placeholderTextColor="#A3A3A3"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  textContentType="password"
                />
                <TouchableOpacity onPress={() => setShowConfirm(p => !p)} style={styles.eyeButton}>
                  <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={22} color="#666" />
                </TouchableOpacity>
              </View>

              {confirm.length > 0 && !matchOK && (
                <Text style={styles.errorInline}>비밀번호가 일치하지 않습니다.</Text>
              )}

              {/* 규칙 체크 목록 */}
              <View style={styles.ruleList}>
                <RuleItem ok={rules.lengthOK} label="8 ~ 16자" />
                <RuleItem ok={rules.hasLetter} label="영문 포함" />
                <RuleItem ok={rules.hasNumber} label="숫자 포함" />
                <RuleItem ok={rules.hasSpecial} label="특수문자 포함" />
                <RuleItem ok={matchOK} label="비밀번호 일치" />
              </View>

              {/* 에러 박스 */}
              {errorMsg && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorBoxTitle}>오류</Text>
                  <Text style={styles.errorBoxText}>{errorMsg}</Text>
                </View>
              )}

            </View>
          </ScrollView>

          {/* ⬇️ CTA — QuestionWrapper의 버튼 테마 */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.95}
              style={[styles.cta, (loading || !rules.isValid || !matchOK) && styles.ctaDisabled]}
              onPress={handleNext}
              disabled={loading || !rules.isValid || !matchOK}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.ctaText} allowFontScaling={false}>다음</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function RuleItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <View style={styles.ruleItem}>
      <Ionicons
        name={ok ? 'checkmark-circle' : 'ellipse-outline'}
        size={18}
        color={ok ? PRIMARY : '#999'}
        style={{ marginRight: 6 }}
      />
      <Text style={[styles.ruleText, ok && styles.ruleTextOk]}>{label}</Text>
    </View>
  );
}

const mono = Platform.select({ ios: 'Menlo', android: 'monospace' }) as string;

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, backgroundColor: '#fff' },
  kav: { flex: 1 },

  // ⬇️ QuestionWrapper 기준: 아래에서 시작 + 좌우 INSET 40
  content: { paddingTop: 72, paddingHorizontal: INSET, paddingBottom: 24, backgroundColor: '#fff' },

  backButton: { marginBottom: 20 },

  // 타이틀/서브 — QuestionWrapper 타이포
  textContainer: { marginBottom: 18 },
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111',
    textAlign: 'left',
    lineHeight: 26,
  },
  subtitle: { fontSize: 13, color: '#6A6A76', marginTop: 6 },

  // 입력
  inputWrapper: { position: 'relative', marginBottom: 16 }, // 간격 약간 넓힘
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6EF',
    fontSize: 16,
    paddingVertical: 12,
    paddingRight: 40,
    color: '#111',
  },
  eyeButton: { position: 'absolute', right: 0, top: '50%', transform: [{ translateY: -12 }], padding: 4 },

  errorInline: { color: '#E5484D', fontSize: 13, marginTop: 4, marginBottom: 8 },

  ruleList: { marginTop: 6, marginBottom: 16 },
  ruleItem: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  ruleText: { fontSize: 14, color: '#777' },
  ruleTextOk: { color: '#333', fontWeight: '700' },

  errorBox: {
    backgroundColor: '#FEECEC',
    borderColor: '#F5C2C7',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  errorBoxTitle: { fontWeight: '700', color: '#B42318', marginBottom: 4 },
  errorBoxText: { color: '#B42318' },

  debugBox: { marginTop: 16, padding: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, backgroundColor: '#FAFAFA' },
  debugTitle: { fontWeight: '700', marginBottom: 8, color: '#111' },
  debugLabel: { fontWeight: '600', marginBottom: 4, color: '#444' },
  debugMono: { fontFamily: mono, fontSize: 12, color: '#222' },

  // CTA — QuestionWrapper 동일 테마
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

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },

    // Android elevation
    elevation: 3,
  },
  ctaDisabled: { opacity: 0.4 },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700', lineHeight: 16 },
});
