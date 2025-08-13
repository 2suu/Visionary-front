// screens/SignUpVerifyCodeScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSignUp } from '../screens/signup-context';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? 'http://localhost:8080';

export default function SignUpVerifyCodeScreen() {
  const router = useRouter();
  const { data } = useSignUp();
  const { name, rrn7, carrier, phone, transactionId } = data;

  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(180);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!name || !rrn7 || !phone) {
      Alert.alert('잘못된 접근', '본인인증 정보가 없습니다.');
      router.replace('/signup-verify');
      return;
    }
    if (!transactionId) {
      Alert.alert('안내', '인증번호 요청 정보가 없습니다. 다시 받아주세요.');
      router.replace('/signup-verify');
    }
  }, [name, rrn7, phone, transactionId]);

  useEffect(() => {
    if (timer <= 0) { setExpired(true); return; }
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
      Alert.alert('알림', '인증번호를 정확히 입력해주세요.');
      return;
    }
    if (expired) {
      Alert.alert('만료됨', '시간이 만료되었습니다. 다시 받아주세요.');
      return;
    }

    try {
      setLoading(true);

      // ✅ 서버가 한글 키를 기대할 가능성이 높음 → 한글 키로 전달
      // ✅ tx id 키도 모든 후보를 같이 보냄(고유Id, txId, transactionId)
      const payload = {
        이름: name,
        주민등록번호: rrn7,
        통신사: carrier,
        전화번호: phone,
        인증번호: c,
        고유Id: transactionId,
        txId: transactionId,
        transactionId: transactionId,
      };

      console.log('[VERIFY REQ]', payload);

      const res = await fetch(`${API_BASE}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 서버가 세션 쿠키 기반이면 주석 해제
         credentials: 'include',
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      console.log('[VERIFY RES]', res.status, text);
      let json: any = null;
      try { json = JSON.parse(text); } catch {}
      console.log('[VERIFY RES]', res.status, json ?? text);

      const httpOk = res.status === 200;
      const bodyOk = json?.응답코드 === 200 || json?.status === 200 || json?.ok === true;

      if (httpOk || bodyOk) {
        router.replace('/signup-nickname');
      } else {
        const msg =
          json?.응답메세지 ||
          json?.message ||
          (res.status === 403 ? '검증 권한이 없거나 요청 형식이 맞지 않습니다.' : '인증 실패');
        Alert.alert('실패', msg);
      }
    } catch (e: any) {
      Alert.alert('오류', e?.message ?? '네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          이름: name,
          주민등록번호: rrn7,
          통신사: carrier,
          전화번호: phone,
        }),
      });
      const text = await res.text();
      let json: any = null;
      try { json = JSON.parse(text); } catch {}
      console.log('[RESEND RES]', res.status, json ?? text);

      if (res.status === 200 || json?.응답코드 === 200) {
        Alert.alert('안내', json?.응답메세지 ?? '인증번호가 재전송되었습니다.');
        setTimer(180);
        setExpired(false);
        setCode('');
        // 재전송 시 새로운 고유Id가 나오면 갱신 필요
        // if (json?.고유Id || json?.txId || json?.transactionId) {
        //   setField('transactionId', String(json.고유Id || json.txId || json.transactionId));
        // }
      } else {
        Alert.alert('실패', json?.응답메세지 ?? '재전송에 실패했습니다.');
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
        <Text style={styles.subtitle}>{phone} 로 받은 코드를 입력하세요</Text>

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

        <TouchableOpacity onPress={resend} disabled={loading}>
          <Text style={styles.resend}>인증번호 다시 받기</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 8 }}>
          <Text style={{ color: '#888' }}>
            <Ionicons name="chevron-back" size={16} /> 뒤로가기
          </Text>
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
  resend: { marginTop: 12, color: '#4E41FF', fontWeight: '600' },
});
