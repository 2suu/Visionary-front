// screens/SignUpCompleteScreen.tsx
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { useSignUp } from './signup-context';

const RAW_BASE = (process.env.EXPO_PUBLIC_API_BASE ?? 'http://localhost:8080').replace(/\/+$/, '');
const API_BASE = (Platform.OS === 'android' && RAW_BASE.includes('localhost'))
  ? RAW_BASE.replace('localhost', '10.0.2.2')
  : RAW_BASE;

export default function SignUpCompleteScreen() {
  const router = useRouter();
  const { data, reset } = useSignUp();
  const nickname = data.nickname ?? '';
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current) return;
    onceRef.current = true;

    (async () => {
      try {
        const url = `${API_BASE}/api/auth/signup`;

        const payload = {
          id: (data.userId ?? '').trim(),
          nickName: (data.nickname ?? '').trim(),
          password: data.password ?? '',
          transactionId: data.transactionId ?? '',
        };

        // 빠른 유효성 검사
        const missing = Object.entries(payload).filter(([, v]) => !v);
        if (missing.length) {
          throw new Error(`회원가입 정보가 불완전합니다: ${missing.map(([k]) => k).join(', ')}`);
        }

        // 🔎 요청 로그
        console.log('[SIGNUP] URL =', url);
        console.log('[SIGNUP] payload =', { ...payload, password: '***' });

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(payload),
        });

        const text = await res.text().catch(() => '');
        let json: any = null; 
        try { json = JSON.parse(text); } catch {}

        // 🔎 응답 로그
        console.log('[SIGNUP] status =', res.status, res.statusText);
        console.log('[SIGNUP] headers =', Object.fromEntries(res.headers.entries()));
        console.log('[SIGNUP] raw body =', text);
        if (json) console.log('[SIGNUP] parsed body =', json);

        if (!res.ok) {
          // Spring @Valid 형태일 때 에러 메시지 추출
          const detail =
            json?.errors?.map?.((e: any) => `${e.field}: ${e.defaultMessage}`).join('\n')
            || json?.message
            || text
            || '요청 값이 유효하지 않습니다.';

          if (res.status === 409) {
            throw new Error(detail || '이미 사용 중인 아이디/닉네임입니다.');
          }
          if (res.status === 400) {
            throw new Error(detail || '요청 형식이 올바르지 않습니다.');
          }
          throw new Error(`회원가입 실패 (${res.status}) ${detail}`);
        }

        // 성공
        console.log('[SIGNUP] 회원가입 성공!', json);
        reset();
        router.replace('/(tabs)/home');
      } catch (err: any) {
        console.error('[SIGNUP] error', err);
        Alert.alert('회원가입 실패', err?.message ?? '네트워크 오류가 발생했어요.');
      }
    })();
  }, [data, reset, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.completeText}>회원가입 완료</Text>
      <Text style={styles.welcomeText}>{nickname ? `${nickname}님 반가워요!` : ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 24 },
  emoji: { fontSize: 80, marginBottom: 30 },
  completeText: { fontSize: 18, color: '#666', fontFamily: 'SUIT-Regular', marginBottom: 10 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#4E41FF', fontFamily: 'SUIT-Bold' },
});
