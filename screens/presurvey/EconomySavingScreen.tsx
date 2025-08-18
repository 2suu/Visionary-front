// screens/presurvey/EconomySavingScreen.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';
import { ROUTES, useSurvey } from './survey-context';

type Key = 'none' | 'little' | 'monthly' | 'invest';
type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]; // ⬅️ router.push 인자 타입 안전

const CANONICAL_FULL: Record<Key, string> = {
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
  const { from } = useLocalSearchParams<{ from?: 'confirm' }>(); // ⬅️ 수정 모드 파라미터

  const [selected, setSelected] = useState<Key | null>(() => {
    const entry = Object.entries(CANONICAL_FULL).find(([, full]) => full === data.savingFull);
    return (entry?.[0] as Key) ?? null;
  });
  const [error, setError] = useState<string | null>(null);

  // ⬅️ 공통 이동 함수 (TS2345 해결: RoutePath 사용)
  const goNext = (nextRoute: RoutePath) => {
    if (from === 'confirm') {
      router.replace(ROUTES.confirm);   // 수정 모드면 Confirm 복귀
    } else {
      router.push(nextRoute);           // 일반 모드면 다음 화면
    }
  };

  const onNext = () => {
    if (!selected) {
      setError('질문에 응답해 주세요');
      return;
    }
    setError(null);
    chooseSaving(CANONICAL_FULL[selected]);
    goNext(ROUTES.economySpending);
  };

  return (
    <QuestionWrapper
      question="한 달에 어느 정도 저축이 가능한가요?"
      onNext={onNext}
      error={error}
      topPadding={140}        // 상단 여백
      gapAfterQuestion={24}  // ⬅️ 질문 아래 간격
    >
      <View style={styles.list}>
        {OPTIONS.map(({ key, emoji, uiLabel }) => {
          const active = selected === key;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => setSelected(key)}
              activeOpacity={0.9}
              style={[styles.card, active && styles.cardActive]}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
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
  // QuestionWrapper의 paddingLeft: 8과 좌우 라인업 맞춤
  list: {
    width: '100%',
    paddingHorizontal: 8,
    marginTop: 8,
    rowGap: 14,                 // RN 0.73+; 미지원이면 아래 card.marginBottom 사용
  },
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 14,           // rowGap 미지원 대비
  },
  cardActive: { borderColor: PRIMARY, backgroundColor: '#F5F3FF', shadowOpacity: 0.12 },
  emoji: { fontSize: 18 },
  emojiActive: { transform: [{ scale: 1.02 }] },
  cardText: { fontSize: 16, color: '#111' },
  cardTextActive: { color: PRIMARY, fontWeight: '700' },
});
