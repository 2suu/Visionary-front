// screens/SignUpVerifyCodeScreen.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
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
import { useSignUp } from '../screens/signup-context';

// 상단에 헬퍼/상수는 그대로 유지
const VERIFY_PATHS = [
  '/api/auth/verify-confirm',
  '/auth/verify-confirm',
  '/api/auth/verifyCode',
  '/auth/verifyCode',
  '/api/auth/confirm',
  '/auth/confirm',
  '/api/auth/verify',
  '/auth/verify',
  '/api/auth/verify-code',
];

async function postJsonWithFallback(base: string, paths: string[], payload: any) {
  for (const p of paths) {
    try {
      const res = await fetch(`${base}${p}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      let json: any = null;
      try { json = JSON.parse(text); } catch {}
      console.log('[VERIFY TRY]', p, res.status, json ?? text);

      if (res.ok || json?.ok === true || json?.status === 200 || json?.응답코드 === 200) {
        return { ok: true, path: p, res, json: json ?? text };
      }
    } catch (e) {
      console.log('[VERIFY ERROR]', p, e);
    }
  }
  return { ok: false, path: null, res: null, json: null };
}

const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? 'http://localhost:8080';

const PRIMARY = '#4E41FF';
const INSET = 40;

export default function SignUpVerifyCodeScreen() {
  const router = useRouter();
  const { data } = useSignUp();
  const { transactionId } = data;

  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(180);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!transactionId) {
      Alert.alert('잘못된 접근', '인증 요청 정보가 없습니다.');
      router.replace('/signup-verify');
    }
  }, [transactionId]);

  useEffect(() => {
    if (timer <= 0) {
      setExpired(true);
      return;
    }
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const mmss = useMemo(() => {
    const m = Math.floor(timer / 60).toString().padStart(2, '0');
    const s = (timer % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, [timer]);

  const handleVerify = async () => {
    const c = code.trim();
    if (!c || c.length < 4) {
      Alert.alert('알림', '인증번호를 입력해주세요.');
      return;
    }
    if (expired) {
      Alert.alert('만료', '인증시간이 지났습니다. 다시 시도해주세요.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        transactionId: transactionId,
        verificationCode: c, // DTO 필드명 동일
      };

      console.log('[VERIFY REQ]', payload);

      const res = await fetch(`${API_BASE}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let json: any = null;
      try { json = JSON.parse(text); } catch {}
      console.log('[VERIFY RES]', res.status, json ?? text);

      if (res.ok) {
        router.replace('/signup-nickname');
      } else {
        const msg =
          json?.message ||
          (res.status === 403 ? '인증번호가 틀렸거나 만료되었습니다.' : '인증 실패');
        Alert.alert('실패', msg);
      }
    } catch (e: any) {
      Alert.alert('오류', e?.message ?? '네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
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
              {/* (선택) 상단 뒤로가기 아이콘 — 필요 없으면 이 블록 삭제 */}
              {/* <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="chevron-back" size={24} color="#333" />
              </TouchableOpacity> */}

              {/* ⬇️ 질문(타이틀) — QuestionWrapper와 동일 타이포 */}
              <Text style={styles.title} allowFontScaling={false}>인증번호 입력</Text>
              <Text style={styles.sub} allowFontScaling={false}>
                휴대폰으로 전송된 인증번호를 입력해주세요
              </Text>

              {/* 입력 + 타이머 */}
              <View style={styles.inputRow}>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder="인증번호"
                  keyboardType="number-pad"
                  maxLength={6}
                  style={styles.input}
                  editable={!expired && !loading}
                  placeholderTextColor="#A3A3A3"
                />
                <Text style={[styles.timer, expired && styles.timerExpired]} allowFontScaling={false}>
                  {expired ? '만료' : mmss}
                </Text>
              </View>

            </View>
          </ScrollView>

          {/* ⬇️ CTA — QuestionWrapper의 cta 모양 그대로 */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={handleVerify}
              disabled={expired || loading}
              style={[styles.cta, (expired || loading) && styles.ctaDisabled]}
            >
              <Text style={styles.ctaText} allowFontScaling={false}>
                {loading ? '확인 중…' : '확인'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, backgroundColor: '#fff' },

  // QuestionWrapper 기준: 아래서 시작 + 좌우 INSET 40
  content: { paddingTop: 72, paddingHorizontal: INSET, paddingBottom: 24 },

  // 타이틀/서브 — QuestionWrapper 타이포
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111',
    textAlign: 'left',
    lineHeight: 26,
    marginBottom: 8,
  },
  sub: { fontSize: 15, color: '#6A6A76', marginBottom: 18 },

  // 입력행
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E6E6EF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111',
    backgroundColor: '#fff',
  },
  timer: { width: 60, textAlign: 'right', fontWeight: '700', color: '#111' },
  timerExpired: { color: '#E5484D' },

  // (선택) 아이콘형 뒤로가기
  backBtn: { marginBottom: 16 },

  // (선택) 텍스트형 뒤로가기
  backTextBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  backText: { color: '#888' },

  // CTA (QuestionWrapper 동일)
  footer: {
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
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
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center', lineHeight: 16 },
});
