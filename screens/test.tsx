// app/ping-test.tsx  ← 주소창에 /ping-test 로 접근 가능
import api from '@/api/client';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Status = 'idle' | 'loading' | 'ok' | 'error';

export default function PingTest() {
  const [status, setStatus] = useState<Status>('idle');
  const [payload, setPayload] = useState<any>(null);
  const [err, setErr] = useState<string>('');

  const runPing = async () => {
    setStatus('loading'); setErr(''); setPayload(null);
    try {
      const res = await api.get('/api/ping'); // ✅ 반드시 api 인스턴스
      setPayload(res.data);
      setStatus('ok');
    } catch (e: any) {
      setErr(e?.message ?? 'Unknown error');
      setStatus('error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ping Test</Text>
      <Text>Origin: <Text style={styles.mono}>{Platform.select({ web: window.location.origin, default: 'native' }) as any}</Text></Text>
      <Text>BaseURL: <Text style={styles.mono}>{String((api.defaults as any).baseURL)}</Text></Text>

      <TouchableOpacity style={styles.btn} onPress={runPing}>
        <Text style={styles.btnText}>{status === 'loading' ? '핑 중...' : '핑 보내기'}</Text>
      </TouchableOpacity>

      <View style={styles.box}>
        <Text>Status: <Text style={styles.mono}>{status}</Text></Text>
        {status === 'ok' && (
          <Text style={[styles.mono, { marginTop: 8 }]}>{JSON.stringify(payload, null, 2)}</Text>
        )}
        {status === 'error' && (
          <Text style={[styles.mono, { marginTop: 8 }]}>{err}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700' },
  btn: { backgroundColor: '#4E41FF', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  box: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, marginTop: 10, minHeight: 80 },
  mono: { fontFamily: Platform.select({ web: 'monospace', default: 'monospace' }) as any },
});
