// components/BasicInfoHeader.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';

type BasicItem = { category: 'AGE'|'GENDER'|'EDUCATION'|'CAREER'; label: string; value: string };
type ApiOk = { code: 200; status: 'OK'; message: string; data: BasicItem[] };
type ApiErr = { code: number; status: string; message: string };

type Props = {
  surveySessionId: number | string;
  token?: string;                 // 인증 필요 시
  name?: string;                  // 카드 타이틀(없으면 기본값)
  showFallbackNotice?: boolean;   // 실패 시 예시 데이터 안내 문구 노출 여부(기본 true)
};

const RAW_BASE = (process.env.EXPO_PUBLIC_API_BASE ?? 'http://localhost:8080').replace(/\/+$/, '');
const API_BASE = (Platform.OS === 'android' && RAW_BASE.includes('localhost'))
  ? RAW_BASE.replace('localhost', '10.0.2.2')
  : RAW_BASE;

/** ⬇️ 실패 시 사용할 예시 데이터 */
const FALLBACK: BasicItem[] = [
  { category: 'AGE',       label: '나이',      value: '23세' },
  { category: 'GENDER',    label: '성별',      value: '남자' },
  { category: 'EDUCATION', label: '최종 학력', value: '4년제 대학교 재학' },
  { category: 'CAREER',    label: '경력',      value: '신입' },
];

export default function BasicInfoHeader({
  surveySessionId,
  token,
  name = '기본정보',
  showFallbackNotice = true,
}: Props) {
  const [rows, setRows] = useState<BasicItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState(false); // ⬅️ 예시 데이터 사용 여부

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        setUsedFallback(false);

        const url = `${API_BASE}/api/survey-sessions/${surveySessionId}/results/basic-info-career`;
        const res = await fetch(url, {
          headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const text = await res.text();
        const json = text ? (JSON.parse(text) as ApiOk | ApiErr) : null;

        if (!res.ok) {
          const msg = (json && 'message' in json) ? json.message : `HTTP ${res.status}`;
          throw new Error(msg);
        }
        if (!alive) return;
        setRows((json as ApiOk).data ?? []);
      } catch (e: any) {
        if (!alive) return;
        const message = e?.message ?? 'Unknown error';
        console.warn('[BasicInfoHeader] fetch failed, using FALLBACK:', message);
        setErr(message);
        setRows(FALLBACK);          // ⬅️ 실패 시 예시 데이터로 대체
        setUsedFallback(false);      // ⬅️ 안내 문구 노출 여부 제어
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [surveySessionId, token]);

  // {AGE:'23세', ...}로 접근 쉽게
  const mapped = useMemo(() => {
    const m: Partial<Record<BasicItem['category'], string>> = {};
    (rows ?? []).forEach(it => { m[it.category] = it.value; });
    return {
      age: m.AGE ?? '-',
      gender: m.GENDER ?? '-',
      edu: m.EDUCATION ?? '-',
      career: m.CAREER ?? '-',
    };
  }, [rows]);

  if (loading) {
    return (
      <View style={[styles.card, { alignItems:'center', paddingVertical:24 }]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{name}</Text>
      <View style={styles.grid2}>
        <InfoBox icon="🎂" label=" 나이" value={mapped.age} />
        <InfoBox icon="👥" label=" 성별" value={mapped.gender} />
        <InfoBox icon="🎓" label=" 최종 학력" value={mapped.edu} />
        <InfoBox icon="💼" label=" 경력" value={mapped.career} />
      </View>

      {/* ⬇️ 실패 시, 예시 데이터 사용 안내 (옵션) */}
      {showFallbackNotice && usedFallback && (
        <Text style={{ marginTop:8, fontSize:12, color:'#999' }}>
          ⚠️ 서버 응답 실패로 예시 데이터를 표시 중입니다.
        </Text>
      )}
    </View>
  );
}

function InfoBox({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoBox}>
      <Text style={{ fontSize: 28, marginRight: 8 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor:'#fff', borderRadius:14, padding:16, marginTop: 30,
          shadowColor:'#000', shadowOpacity:0.06, shadowRadius:8, elevation:2 },
  title:{ fontSize:18, fontWeight:'800', marginBottom:12 },
  grid2:{ flexDirection:'row', flexWrap:'wrap', columnGap:12, rowGap:12 },
  infoBox:{
    width:'47%', backgroundColor:'#FAFAFE', borderRadius:14, padding:14, elevation:1,
    flexDirection:'row', alignItems:'center',
  },
  infoLabel:{ marginTop:6, color:'#6A6A76', fontSize:12 },
  infoValue:{ fontSize:16, fontWeight:'700', marginTop:2 },
});
