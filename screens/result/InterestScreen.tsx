// screens/result/InterestScreen.tsx
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const PRIMARY = '#4E41FF';
const GREEN = '#16A34A';
const PURPLE = '#7C3AED';
const BLUE = '#2563EB';
const ORANGE = '#EA580C';
const GRAY_TEXT = '#6A6A76';

const { width } = Dimensions.get('window');
const CARD_HPAD = 16;
const INNER_GAP = 24;
const CHART_W = width - CARD_HPAD * 2 - INNER_GAP;
const BAR_W = CHART_W;

type InterestKey = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'; // RIASEC

export default function InterestScreen() {
  // 예시 데이터 (서버 값으로 교체)
  const riasec = useMemo(
    () => ({ R: 75, I: 60, A: 90, S: 90, E: 50, C: 40 }),
    []
  );

  const labels = ['실제형', '탐구형', '예술형', '사회형', '기업형', '관습형'];
  const chartData = {
    labels,
    datasets: [{ data: [riasec.R, riasec.I, riasec.A, riasec.S, riasec.E, riasec.C] }],
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>흥미분석</Text>

      {/* 상단 탭 표시 */}
      <View style={styles.subTab}>
        <View style={[styles.subTabIndicator, { width: 42 }]} />
        <Text style={styles.subTabText}>흥미</Text>
      </View>

      {/* LineChart (Radar 대체) */}
      <LineChart
        data={chartData}
        width={CHART_W}
        height={240}
        withShadow
        withInnerLines
        withOuterLines
        withDots
        fromZero
        yAxisSuffix="%"
        segments={5}
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (o = 1) => `rgba(78,65,255,${o})`,
          labelColor: () => '#666',
          propsForDots: { r: '4' },
          propsForBackgroundLines: { strokeDasharray: '4,6' },
        }}
        bezier
        style={{ alignSelf: 'center', marginVertical: 8 }}
      />

      {/* 상단 2개 강조 카드 */}
      <View style={styles.cardGrid}>
        <CategoryCard
          title="예술형"
          percent={riasec.A}
          accent={PURPLE}
          icon="💡"
          tags={['창의적', '직관적', '표현적']}
        />
        <CategoryCard
          title="사회형"
          percent={riasec.S}
          accent={GREEN}
          icon="🧩"
          tags={['대인관계', '협력적', '이타성']}
        />
      </View>

      {/* 나머지 카드 */}
      <View style={styles.cardGrid}>
        <CategoryCard
          title="실제형"
          percent={riasec.R}
          accent={BLUE}
          icon="🛠️"
          tags={['실용적', '현실적', '손기술']}
        />
        <CategoryCard
          title="탐구형"
          percent={riasec.I}
          accent={ORANGE}
          icon="🔬"
          tags={['분석적', '문제해결', '호기심']}
        />
        <CategoryCard
          title="기업형"
          percent={riasec.E}
          accent="#8B5CF6"
          icon="📈"
          tags={['목표지향', '리더십', '설득']}
        />
        <CategoryCard
          title="관습형"
          percent={riasec.C}
          accent="#0EA5E9"
          icon="🗂️"
          tags={['정확함', '신뢰성', '체계적']}
        />
      </View>

      {/* 막대 바(선택 사항: 시각 강화) */}
      <View style={{ marginTop: 8 }}>
        <BarRow label="예술형" value={riasec.A} />
        <BarRow label="사회형" value={riasec.S} />
        <BarRow label="실제형" value={riasec.R} />
        <BarRow label="탐구형" value={riasec.I} />
        <BarRow label="기업형" value={riasec.E} />
        <BarRow label="관습형" value={riasec.C} />
      </View>

      <Text style={styles.sectionH2}>종합 분석 결과</Text>
      <Text style={styles.summary}>
        예술형·사회형 성향이 높아 {`'표현/창의'`}와 {`'사람과의 상호작용'`} 상황에서 강점을 보입니다.
        직관적이고 공감 능력이 뛰어나며, 문제를 창의적으로 해결하는 편입니다. 탐구형 성향도 있어
        분석적 접근을 곁들인 콘텐츠/교육/디자인 관련 직무에서 만족도가 높을 수 있습니다.
      </Text>
    </View>
  );
}

/* ── 작은 컴포넌트들 ────────────────────────────── */

function CategoryCard({
  title,
  percent,
  accent,
  icon,
  tags,
}: {
  title: string;
  percent: number;
  accent: string;
  icon: string;
  tags: string[];
}) {
  return (
    <View style={[styles.catCard, { borderColor: accent }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        <Text style={{ fontSize: 18, marginRight: 8 }}>{icon}</Text>
        <Text style={{ fontWeight: '800' }}>{title}</Text>
        <View style={{ flex: 1 }} />
        <Text style={{ color: accent, fontWeight: '800' }}>{percent}%</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {tags.map((t) => (
          <TagPill key={t} text={t} color={accent} />
        ))}
      </View>
    </View>
  );
}

function TagPill({ text, color }: { text: string; color: string }) {
  return (
    <View style={[styles.pill, { borderColor: color }]}>
      <Text style={[styles.pillText, { color }]}>{text}</Text>
    </View>
  );
}

function BarRow({ label, value }: { label: string; value: number }) {
  const dotLeftRaw = (BAR_W * value) / 100 - 8; // 점 반지름 보정
  const dotLeft = Math.max(-2, Math.min(BAR_W - 14, dotLeftRaw));

  return (
    <View style={{ marginTop: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ fontWeight: '600' }}>{label}</Text>
        <Text style={{ color: GRAY_TEXT }}>{value}%</Text>
      </View>

      <View style={[styles.barTrack, { width: BAR_W }]}>
        <View style={[styles.barFill, { width: `${value}%` }]} />
        <View style={[styles.barDot, { left: dotLeft }]} />
      </View>
    </View>
  );
}

/* ── styles ─────────────────────────────────────── */

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: CARD_HPAD,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 6 },

  subTab: { marginTop: 6, marginBottom: 12 },
  subTabIndicator: { height: 2, backgroundColor: PRIMARY, borderRadius: 2 },
  subTabText: { marginTop: 8, color: GRAY_TEXT },

  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  catCard: {
    flexGrow: 1,
    minWidth: (CHART_W - 12) / 2, // 2열 그리드
    borderWidth: 1.2,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
  pill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 999,
  },
  pillText: { fontSize: 12, fontWeight: '600' },

  // 바 그래프
  barTrack: {
    height: 10,
    backgroundColor: '#EFEFF4',
    borderRadius: 999,
    overflow: 'hidden',
    position: 'relative',
  },
  barFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: PRIMARY,
    borderRadius: 999,
  },
  barDot: {
    position: 'absolute',
    top: -3,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#B3A9FF',
  },

  sectionH2: { fontSize: 16, fontWeight: '800', marginTop: 20, marginBottom: 6 },
  summary: { color: '#4B5563', lineHeight: 20 },
});
