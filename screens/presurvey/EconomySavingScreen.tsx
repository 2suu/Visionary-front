// screens/presurvey/EconomySavingScreen.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';
import { ROUTES, useSurvey } from './survey-context';

type Key = 'none' | 'little' | 'monthly' | 'invest';

const CANONICAL_FULL: Record<Key, string> = {
  // ✅ survey-context의 SAVING_SHORT 매핑과 정확히 동일한 문장(이모지+띄어쓰기 포함)
  none:   '🚫 저축할 여유가 없다',
  little: '💰 조금씩이라도 저축 중이다',
  monthly:'📅 매달 일정 금액 이상 저축 중이다',
  invest: '📈 저축 외에도 투자까지 여유가 있다',
};

const OPTIONS: { key: Key; emoji: string; uiLabel: string }[] = [
  { key: 'none',    emoji: '🚫', uiLabel: '저축할 여유가 없어요' },
  { key: 'little',  emoji: '💰', uiLabel: '조금씩이라도 저축하고 있어요' },
  { key: 'monthly', emoji: '📅', uiLabel: '매달 일정금액 이상 저축하고 있어요' },
  { key: 'invest',  emoji: '📈', uiLabel: '저축 외에도 투자까지 여유가 있어요' },
];

const PRIMARY = '#4E41FF';

export default function EconomySavingScreen() {
  const { data, chooseSaving } = useSurvey();
  const [selected, setSelected] = useState<Key | null>(() => {
    // 저장된 savingFull을 역매핑해서 초기 선택 표시
    const entry = Object.entries(CANONICAL_FULL).find(([, full]) => full === data.savingFull);
    return (entry?.[0] as Key) ?? null;
  });
  const [error, setError] = useState<string | null>(null);

  const onNext = () => {
    if (!selected) {
      setError('질문에 응답해 주세요');
      return;
    }
    setError(null);
    // ✅ 컨텍스트에 "정식 문장" 저장 → 내부에서 짧은 라벨까지 자동 세팅
    chooseSaving(CANONICAL_FULL[selected]);
    router.push(ROUTES.economySpending);
  };

  return (
    <QuestionWrapper question="한 달에 어느 정도 저축이 가능한가요?" onNext={onNext} error={error}>
      <View style={styles.list}>
        {OPTIONS.map(({ key, emoji, uiLabel }) => {
          const active = selected === key;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => setSelected(key)}
              activeOpacity={0.9}
              style={[styles.card, active && styles.cardActive]}
            >
              <Text style={[styles.emoji, active && styles.emojiActive]}>{emoji}</Text>
              <Text style={[styles.cardText, active && styles.cardTextActive]}>{uiLabel}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </QuestionWrapper>
  );
}

const styles = StyleSheet.create({
  list: { width: '100%', gap: 14, marginTop: 8 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 14, paddingVertical: 16, paddingHorizontal: 16,
    borderWidth: 1, borderColor: '#E8E8E8', backgroundColor: 'white',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardActive: { borderColor: PRIMARY, backgroundColor: '#F5F3FF', shadowOpacity: 0.12 },
  emoji: { fontSize: 18 },
  emojiActive: { transform: [{ scale: 1.02 }] },
  cardText: { fontSize: 16, color: '#111' },
  cardTextActive: { color: PRIMARY, fontWeight: '700' },
});
