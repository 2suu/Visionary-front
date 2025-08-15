import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  value?: 1|2|3|4|5;
  onChange: (v: 1|2|3|4|5) => void;
};

const PRIMARY = '#4E41FF';
const DOT = 16;               // 원(점) 지름
const COL_GAP = 28;           // 칼럼 간 간격
const COL_WIDTH = DOT + 24;   // 칼럼 고정 폭 (중앙선 정렬 안정화)
const LABEL_H = 34;           // 라벨 영역 높이
const NUM_H = 22;             // 숫자 영역 높이
const TOP_GAP = 6;            // 라벨↔점 간격
const BOTTOM_GAP = 6;         // 점↔숫자 간격

const TOTAL_WIDTH = COL_WIDTH * 5 + COL_GAP * 4; // 전체 군집 너비

export default function Likert({ value, onChange }: Props) {
  const cols: (1|2|3|4|5)[] = [1,2,3,4,5];

  return (
    <View style={styles.wrap}>
      {/* 라벨 행: 첫/마지막만 텍스트. 각 칼럼 중앙선에 정렬 */}
      <View style={styles.row}>
        {cols.map((n, i) => (
          <View key={`label-${n}`} style={styles.col}>
            <View style={styles.labelBox}>
              <Text style={styles.label}>
                {i===0 ? '전혀\n아니다' : i===4 ? '매우\n그렇다' : ' '}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* 점(원) 행 */}
      <View style={[styles.row, { marginTop: TOP_GAP }]}>
        {cols.map((n) => {
          const active = value === n;
          return (
            <View key={`dot-${n}`} style={styles.col}>
              <TouchableOpacity
                onPress={() => onChange(n)}
                style={styles.hit}
                accessibilityRole="button"
                accessibilityLabel={`${n} 선택`}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <View style={[styles.dot, active && styles.dotActive]} />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* 숫자 행: 각 점 하단 중앙 정렬 */}
      <View style={[styles.row, { marginTop: BOTTOM_GAP }]}>
        {cols.map((n) => (
          <View key={`num-${n}`} style={styles.col}>
            <View style={styles.numBox}>
              <Text style={styles.num}>{n}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // 전체 군집을 화면 중앙에
  wrap: {
    marginTop: 20,
    alignSelf: 'center',
    width: TOTAL_WIDTH,
    paddingTop: 90,
  },
  // 가로 5등분 + 균등 간격
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // 각 칼럼은 동일한 고정 폭 + 중앙 정렬
  col: {
    width: COL_WIDTH,
    alignItems: 'center',
  },

  // 라벨/숫자는 고정 높이 박스 중앙에 배치 → 텍스트 베이스라인 영향 제거
  labelBox: {
    height: LABEL_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numBox: {
    height: NUM_H,
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    color: '#222',
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  hit: {
    width: DOT + 18,
    height: DOT + 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: '#D9D9D9',
  },
  dotActive: { backgroundColor: PRIMARY },

  num: { color: '#222', fontSize: 13, textAlign: 'center' },
});
