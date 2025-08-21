// app/survey/Q47PriorityScreen.tsx
// Q47. 우선순위 매기기

import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from '../../screens/survey/QuestionWrapper';
import type { PriorityKey } from '../../screens/survey/survey-context';
import { useSurvey } from '../../screens/survey/survey-context';

const PRIMARY = '#4E41FF';

/** UI 라벨 ↔ 저장키(PriorityKey) 명시적 매핑 */
const ITEMS = [
  { ui: '💵 경제상황 및 대인관계', key: '경제상황및대인관계' as PriorityKey },
  { ui: '🌟 관심분야',             key: '관심분야' as PriorityKey },
  { ui: '🙂 성격',                 key: '성격' as PriorityKey },
  { ui: '🧠 흥미',                 key: '흥미' as PriorityKey },
  { ui: '🚻 성별',                 key: '성별' as PriorityKey },
  { ui: '🎂 나이',                 key: '나이' as PriorityKey },
] as const;

type Item = typeof ITEMS[number];
const MAX = ITEMS.length;

export default function Q47PriorityScreen() {
  const { data, setField } = useSurvey();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isEdit = mode === 'edit';

  /** 저장값(priorityOrder)이 있으면 PriorityKey[] 그대로 복원 */
  const restoreFromSaved = (): PriorityKey[] => {
    const arr = Array.isArray(data.priorityOrder) ? data.priorityOrder : [];
    const allowed = new Set(ITEMS.map(it => it.key));
    const filtered = arr.filter(k => allowed.has(k));
    // 중복 제거 + 최대 6개
    const uniq: PriorityKey[] = [];
    filtered.forEach(k => { if (!uniq.includes(k)) uniq.push(k); });
    return uniq.slice(0, MAX);
  };

  /** 상태는 PriorityKey[]로 관리 (라벨 아님) */
  const [orderKeys, setOrderKeys] = useState<PriorityKey[]>(restoreFromSaved);

  // 안전 정리(중복/없음 제거)
  useEffect(() => {
    setOrderKeys(prev => {
      const allowed = new Set(ITEMS.map(it => it.key));
      const filtered = prev.filter(k => allowed.has(k)).slice(0, MAX);
      const uniq: PriorityKey[] = [];
      filtered.forEach(k => { if (!uniq.includes(k)) uniq.push(k); });
      return uniq;
    });
  }, []);

  const isSelected = (key: PriorityKey) => orderKeys.includes(key);
  const getRank = (key: PriorityKey) => {
    const idx = orderKeys.indexOf(key);
    return idx === -1 ? null : idx + 1;
  };

  const toggle = (key: PriorityKey) => {
    setOrderKeys(prev => {
      if (prev.includes(key)) return prev.filter(k => k !== key);
      if (prev.length >= MAX) return prev;
      return [...prev, key];
    });
  };

  const isValid = useMemo(() => orderKeys.length === ITEMS.length, [orderKeys]);

  const onSave = () => {
    if (!isValid) return;
    console.log('[Q47] save priorityOrder:', orderKeys);
    setField('priorityOrder', orderKeys);
    router.replace('/survey/confirm' as const);
  };

  return (
    <QuestionWrapper
      title="Q47. 아래 항목들 중, 진로 선택 시 자신에게 중요한 요소를 우선순위에 따라 번호로 매겨주세요."
      progressText="47/47"
      progressPct={100}
      onNext={onSave}
      disabled={!isValid}
    >
      <Text style={styles.sub}>
        <Text style={styles.bold}>1번이 가장 중요</Text>하다고 생각하는 항목입니다.
      </Text>

      <View style={styles.grid}>
        {ITEMS.map(({ ui, key }) => {
          const selected = isSelected(key);
          const rank = getRank(key);
          return (
            <TouchableOpacity
              key={key}
              activeOpacity={0.9}
              onPress={() => toggle(key)}
              style={[styles.chip, selected && styles.chipActive]}
            >
              {selected && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{rank}</Text>
                </View>
              )}
              <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                {ui}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.helper}>
        {orderKeys.length < ITEMS.length
          ? `선택됨: ${orderKeys.length}/${ITEMS.length} (모두 선택해주세요)`
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
