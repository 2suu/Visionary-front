// app/survey/Q47PriorityScreen.tsx
// Q47. 우선순위 매기기

import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from '../../screens/survey/QuestionWrapper';
import { useSurvey } from '../../screens/survey/survey-context';

const PRIMARY = '#4E41FF';
const ITEMS = ['💵 경제상황 & 대인관계','🌟 관심분야','🙂 성격','🚻 성별','🎂 나이','💼 경력'] as const;
type Item = typeof ITEMS[number];
const MAX = ITEMS.length;

// 이모지/공백 제거 → '경제상황', '가치관' 형태
const strip = (s: string) =>
  s.replace(/[^\p{L}\p{N}\s]/gu, '').trim().replace(/\s+/g, '');

export default function Q47PriorityScreen() {
  const { data, setField } = useSurvey();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isEdit = mode === 'edit';

  // 기존 저장값(priorityOrder)이 있으면 그것을 기반으로 순서 복원
  const restoreFromSaved = (): Item[] => {
    if (!data.priorityOrder || data.priorityOrder.length === 0) return [];
    // saved는 ['관심분야', '가치관', ...] 형식
    const map = new Map(ITEMS.map((it) => [strip(it), it as Item]));
    const restored: Item[] = [];
    data.priorityOrder.forEach((lbl) => {
      const it = map.get(strip(lbl));
      if (it && !restored.includes(it)) restored.push(it);
    });
    return restored;
  };

  const [order, setOrder] = useState<Item[]>(restoreFromSaved);

  // 안전 정리(중복/없는 값 제거)
  useEffect(() => {
    setOrder((prev) => {
      const filtered = prev.filter((v) => ITEMS.includes(v as Item)).slice(0, MAX);
      const uniq: Item[] = [];
      filtered.forEach((v) => { if (!uniq.includes(v)) uniq.push(v); });
      return uniq;
    });
  }, []);

  const isSelected = (item: Item) => order.includes(item);
  const getRank = (item: Item) => {
    const idx = order.indexOf(item);
    return idx === -1 ? null : idx + 1;
  };

  const toggle = (item: Item) => {
    setOrder((prev) => {
      if (prev.includes(item)) return prev.filter((v) => v !== item);
      if (prev.length >= MAX) return prev;
      return [...prev, item];
    });
  };

  // 모든 항목을 선택해야 완료
  const isValid = useMemo(() => order.length === ITEMS.length, [order]);

  const onSave = () => {
    if (!isValid) return;
    // 라벨만 저장 (이모지 제거)
    const saved = order.map((it) => strip(it));
    setField('priorityOrder', saved);
    router.replace('/survey/confirm' as const); // 마지막 문항: 항상 확인 화면으로
  };

  return (
    <QuestionWrapper
      title="Q47. 아래 항목들 중, 진로 선택 시 자신에게 중요한 요소를 우선순위에 따라 번호로 매겨주세요."
      progressText="47/47"
      progressPct={100}
      onNext={onSave}        // 하단 “확인”이 저장 트리거
      disabled={!isValid}
    >
      <Text style={styles.sub}>
        <Text style={styles.bold}>1번이 가장 중요</Text>하다고 생각하는 항목입니다.
      </Text>

      <View style={styles.grid}>
        {ITEMS.map((item) => {
          const selected = isSelected(item);
          const rank = getRank(item);
          return (
            <TouchableOpacity
              key={item}
              activeOpacity={0.9}
              onPress={() => toggle(item)}
              style={[styles.chip, selected && styles.chipActive]}
            >
              {selected && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{rank}</Text>
                </View>
              )}
              <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.helper}>
        {order.length < ITEMS.length
          ? `선택됨: ${order.length}/${ITEMS.length} (모두 선택해주세요)`
          : '모든 항목을 순서대로 선택했습니다.'}
      </Text>
    </QuestionWrapper>
  );
}

const styles = StyleSheet.create({
  sub: { color: '#666', fontSize: 13, lineHeight: 20, marginTop: 4, marginBottom: 12 },
  bold: { fontWeight: '700', color: '#444' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 4 },
  chip: {
    width: '48%', minHeight: 46, borderRadius: 14, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#E6E6E6', paddingVertical: 10, paddingHorizontal: 14,
    marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2, flexDirection: 'row', alignItems: 'center',
  },
  chipActive: { borderColor: PRIMARY, backgroundColor: '#F6F4FF' },
  chipText: { color: '#222', fontSize: 15, fontWeight: '600' },
  chipTextActive: { color: '#222' },
  badge: {
    minWidth: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: PRIMARY,
    alignItems: 'center', justifyContent: 'center', marginRight: 8, paddingHorizontal: 6,
  },
  badgeText: { fontSize: 12, color: PRIMARY, fontWeight: '700' },
  helper: { marginTop: 6, color: '#8A8A8A', fontSize: 12 },
});
