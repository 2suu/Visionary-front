// screens/result/EmotionValuesScreen.tsx
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/** ─────────────────────────────────────────────────────────────
 *  데이터 예시(실서비스에서는 props/context 연동)
 *  ──────────────────────────────────────────────────────────── */
const sample = {
  priority: [
    { label: '성취', score: 95, icon: '🏆', tint: '#F4E6FF' },
    { label: '자율성', score: 90, icon: '🕊️', tint: '#EAF7FF' },
    { label: '창의성', score: 85, icon: '💡', tint: '#FFF6DE' },
    { label: '성장', score: 80, icon: '🌱', tint: '#EFFFF3' },
    { label: '관계', score: 75, icon: '🤝', tint: '#FFF4E5' },
    { label: '안정성', score: 70, icon: '🛡️', tint: '#FFECEC' },
    { label: '봉사', score: 65, icon: '💖', tint: '#FFF0F6' },
    { label: '리더', score: 60, icon: '👍', tint: '#F2F2F2' },
  ],
  relationType: { title: '선택적 친밀형', score: 80, note: '소수와 깊은 관계를 중시' },
  moodType: { title: '약간 기복', note: '가끔씩 기분이 오락가락함' },
  stress: { label: '혼자만의 시간', pct: 90 },
  summary: {
    core: ['성취', '자율성', '창의성'],
    feature:
      '성과 지향적이고 자율성을 중시하며, 새로운 시도를 즐깁니다. ' +
      '관계에서는 넓이보다 깊이를 선호하며, 혼자만의 시간을 통해 에너지를 회복합니다.',
  },
};

/** ─────────────────────────────────────────────────────────────
 *  작은 UI 조각 컴포넌트들
 *  ──────────────────────────────────────────────────────────── */
function TabHeader() {

}

function ValueBadge({
  label,
  score,
  icon,
  tint,
}: {
  label: string;
  score: number;
  icon: string;
  tint?: string;
}) {
  return (
    <View style={[s.badge, { backgroundColor: tint || '#F6F7FB' }]}>
      <Text style={s.badgeIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={s.badgeLabel}>{label}</Text>
        <Text style={s.badgeScore}>{score}%</Text>
      </View>
    </View>
  );
}

function CircleStat({
  title,
  value,
  sub,
  ringColor = '#7C7CFF',
  bg = '#F4F4FF',
}: {
  title: string;
  value?: number;
  sub?: string;
  ringColor?: string;
  bg?: string;
}) {
  return (
    <View style={s.circleCard}>
      <Text style={s.circleTitle}>{title}</Text>
      {/* 원형 뷰 (라이브러리 없이 단색 링 느낌) */}
      <View style={[s.circleWrap, { backgroundColor: bg, borderColor: ringColor }]}>
        <Text style={s.circleValue}>{typeof value === 'number' ? `${value}%` : '🙂'}</Text>
      </View>
      {!!sub && <Text style={s.circleSub}>{sub}</Text>}
    </View>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  const widthPct = Math.max(0, Math.min(100, pct));
  return (
    <View style={s.barWrap}>
      <View style={[s.barFill, { width: `${widthPct}%` }]} />
    </View>
  );
}

/** ─────────────────────────────────────────────────────────────
 *  메인 스크린
 *  ──────────────────────────────────────────────────────────── */
export default function EmotionValuesScreen() {
  const router = useRouter();
  const data = sample; // ← useContext(...)로 교체해도 됨

  const top3 = useMemo(
    () => data.priority.slice(0, 3).map((v) => v.label).join(', '),
    [data.priority]
  );

  const handleNext = () => {
    console.log('[EMOTION][UI] navigate to values screen');
    router.push('/result/values');
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Text style={s.title}>정서/가치관 분석</Text>
      
      {/* 상단 소탭 표시 */}
      <View style={s.subTab}>
        <View style={s.subTabIndicator} />
        <Text style={s.subTabText}>정서분석</Text>
      </View>

      {/* 가치관 우선순위 */}
      <Text style={s.sectionTitle}>가치관 우선순위</Text>
      <View style={s.grid}>
        {data.priority.map((p) => (
          <ValueBadge key={p.label} {...p} />
        ))}
      </View>

      {/* 인간관계 / 감정 추이 */}
      <Text style={s.sectionTitle}>인간관계/감정 추이</Text>
      <View style={s.circleRow}>
        <CircleStat
          title={data.relationType.title}
          value={data.relationType.score}
          sub={data.relationType.note}
        />
        <CircleStat title={data.moodType.title} sub={data.moodType.note} ringColor="#D8B169" bg="#FFF7E8" />
      </View>

      {/* 스트레스 해소법 */}
      <Text style={s.sectionTitle}>스트레스 해소법</Text>
      <View style={s.card}>
        <View style={s.rowBetween}>
          <Text style={s.cardLabel}>{data.stress.label}</Text>
          <Text style={s.cardValue}>{data.stress.pct}%</Text>
        </View>
        <ProgressBar pct={data.stress.pct} />
      </View>

      {/* 종합 분석 */}
      <Text style={s.sectionTitle}>종합 분석</Text>
      <View style={s.card}>
        <Text style={s.blockTitle}>핵심 가치관</Text>
        <Text style={s.dotText}>🏆 {top3}</Text>

        <View style={{ height: 12 }} />
        <Text style={s.blockTitle}>특징 분석</Text>
        <Text style={s.desc}>{data.summary.feature}</Text>
      </View>

      {/* 버튼 영역 */}
      <TouchableOpacity style={s.button} onPress={handleNext} activeOpacity={0.8}>
        <Text style={s.buttonText}>다음</Text>
      </TouchableOpacity>

      {/* 하단 여백 */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/** ─────────────────────────────────────────────────────────────
 *  스타일
 *  ──────────────────────────────────────────────────────────── */
const PRIMARY = '#4E41FF';
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 24 },
  title: { fontSize: 20, fontWeight: '700', color: '#111', marginBottom: 8 },
  tabs: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  tab: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, fontSize: 12 },
  tabActive: { backgroundColor: '#EEF0FF', color: PRIMARY, fontWeight: '700' },
  tabDim: { backgroundColor: '#F4F5F7', color: '#6B7280' },

  // 서브탭 스타일
  subTab: { marginTop: 6, marginBottom: 12 },
  subTabIndicator: { height: 2, backgroundColor: PRIMARY, width: 42, borderRadius: 2 },
  subTabText: { marginTop: 8, color: '#6A6A76' },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginTop: 12, marginBottom: 10 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badge: {
    width: '47%',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: { fontSize: 22, marginRight: 10 },
  badgeLabel: { fontSize: 13, color: '#111', fontWeight: '600' },
  badgeScore: { fontSize: 16, color: '#111', fontWeight: '800' },

  circleRow: { flexDirection: 'row', gap: 12 },
  circleCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ECECEC',
  },
  circleTitle: { fontSize: 13, fontWeight: '700', color: '#111' },
  circleWrap: {
    marginTop: 10,
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 10, // 링 두께
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleValue: { fontSize: 22, fontWeight: '800', color: '#111' },
  circleSub: { marginTop: 10, fontSize: 12, color: '#6A6A76', textAlign: 'center' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ECECEC',
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardLabel: { fontSize: 14, fontWeight: '700', color: '#111' },
  cardValue: { fontSize: 14, fontWeight: '800', color: PRIMARY },

  barWrap: {
    height: 12,
    borderRadius: 999,
    backgroundColor: '#EFEFFE',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: PRIMARY,
  },

  blockTitle: { fontSize: 13, fontWeight: '700', color: '#111', marginBottom: 6 },
  dotText: { fontSize: 13, color: '#111' },
  desc: { marginTop: 2, fontSize: 13, color: '#383A40', lineHeight: 19 },

  // 버튼 스타일
  button: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 24,
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});