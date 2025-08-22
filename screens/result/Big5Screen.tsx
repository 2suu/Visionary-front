import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const PRIMARY = '#4E41FF';
const { width } = Dimensions.get('window');

const CARD_HPAD = 16;
const INNER_GAP = 24; // 카드 안쪽 여백 보정
const CHART_W = width - CARD_HPAD * 2 - INNER_GAP; // 차트 가로
const BAR_W = CHART_W; // 막대 트랙 가로도 차트와 동일하게

export default function Big5Screen() {
  const router = useRouter();
  const big5 = useMemo(() => ({ O: 75, C: 85, E: 85, A: 85, N: 85 }), []);

  const chartData = {
    labels: ['개방성', '성실성', '외향성', '친화성', '신경성'],
    datasets: [
      {
        data: [big5.O, big5.C, big5.E, big5.A, big5.N],
        // LineChart에서는 color를 chartConfig.color가 처리하므로 여기선 생략 가능
      },
    ],
  };

  const handleNext = () => {
    console.log('[BIG5][UI] navigate to interest screen');
    router.push('/result/interest');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>성격 분석</Text>

      {/* 상단 소탭 표시 */}
      <View style={styles.subTab}>
        <View style={styles.subTabIndicator} />
        <Text style={styles.subTabText}>Big5</Text>
      </View>

      {/* Line Chart (Radar 대체) */}
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
        segments={5} // 눈금 0~100을 20% 간격으로
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(78, 65, 255, ${opacity})`,
          labelColor: () => '#666',
          propsForDots: { r: '4' },
          propsForBackgroundLines: { strokeDasharray: '4,6' },
        }}
        bezier
        style={{ alignSelf: 'center', marginVertical: 8 }}
      />

      {/* Bars */}
      <BarRow label="개방성" value={big5.O} />
      <BarRow label="성실성" value={big5.C} />
      <BarRow label="외향성" value={big5.E} />
      <BarRow label="친화성" value={big5.A} />
      <BarRow label="신경성" value={big5.N} />

      <Text style={styles.sectionH2}>종합 분석 결과</Text>
      <Text style={styles.summary}>
        성실성과 외향성이 높아 협업과 리더십에서 강점을 보입니다. 안정적인 환경에서 목표를
        꾸준히 이루며, 타인을 존중하고 과제를 체계적으로 수행하는 편입니다.
      </Text>

      {/* 버튼 영역 */}
      <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.8}>
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ── small components ───────────────────────────── */

function BarRow({ label, value }: { label: string; value: number }) {
  // value(%)를 실제 픽셀로 변환해서 점 위치 계산
  const dotLeftRaw = (BAR_W * value) / 100 - 8; // 점의 반지름 8px 보정
  const dotLeft = Math.max(-2, Math.min(BAR_W - 14, dotLeftRaw)); // 살짝 클램핑

  return (
    <View style={{ marginTop: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ fontWeight: '600' }}>{label}</Text>
        <Text style={{ color: '#6A6A76' }}>{value}%</Text>
      </View>

      {/* 트랙 */}
      <View style={[styles.barTrack, { width: BAR_W }]}>
        {/* 채움 (부모 width 고정이므로 % 사용 OK) */}
        <View style={[styles.barFill, { width: `${value}%` }]} />
        {/* 끝 점 포인트 (숫자 px로 계산) */}
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
  subTabIndicator: { height: 2, backgroundColor: PRIMARY, width: 42, borderRadius: 2 },
  subTabText: { marginTop: 8, color: '#6A6A76' },

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

  sectionH2: { fontSize: 16, fontWeight: '800', marginTop: 18, marginBottom: 6 },
  summary: { color: '#4B5563', lineHeight: 20 },

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
