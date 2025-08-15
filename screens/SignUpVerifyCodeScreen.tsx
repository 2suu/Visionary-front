// screens/SignUpVerifyCodeScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSignUp } from '../screens/signup-context';

// 상단에 헬퍼 추가
const VERIFY_PATHS = [
  '/api/auth/verify-confirm',
  '/auth/verify-confirm',
  '/api/auth/verifyCode',
  '/auth/verifyCode',
  '/api/auth/confirm',
  '/auth/confirm',
  '/api/auth/verify',     // 혹시 간단 버전
  '/auth/verify',
  // 마지막에 기존 경로도 남겨둠 (로그 참고용)
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

export default function SignUpVerifyCodeScreen() {
  const router = useRouter();
  const { data } = useSignUp();
  const { transactionId } = data; // ✅ 이제 이 값만 필요

  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(180);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  // 필수값 없으면 이전 화면으로
  useEffect(() => {
    if (!transactionId) {
      Alert.alert('잘못된 접근', '인증 요청 정보가 없습니다.');
      router.replace('/signup-verify');
    }
  }, [transactionId]);

  // 타이머
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

  // ✅ 인증번호 검증
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
        verificationCode: c, // DTO 필드명과 동일
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>인증번호 입력</Text>
        <Text style={styles.subtitle}>휴대폰으로 전송된 인증번호를 입력해주세요</Text>

        <View style={styles.inputRow}>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="인증번호"
            keyboardType="number-pad"
            maxLength={6}
            style={styles.input}
            editable={!expired && !loading}
          />
          <Text style={[styles.timer, expired && { color: '#E53935' }]}>
            {expired ? '만료' : mmss}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, (expired || loading) && { opacity: 0.6 }]}
          onPress={handleVerify}
          disabled={expired || loading}
        >
          <Text style={styles.buttonText}>{loading ? '확인 중...' : '확인'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 8 }}>
          <Ionicons name="chevron-back" size={16} color="#888" />
          <Text style={{ color: '#888' }}> 뒤로가기</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  input: {
    flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 14, fontSize: 16,
  },
  timer: { width: 56, textAlign: 'right', fontWeight: '600' },
  button: {
    marginTop: 16, backgroundColor: '#4E41FF', paddingVertical: 14,
    borderRadius: 10, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700' },
});
