// screens/presurvey/EconomySpendingScreen.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';
import { ROUTES, useSurvey } from './survey-context';

type Key = 'tight' | 'basic' | 'some' | 'plenty';
type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]; // ⬅️ router.push 인자 타입 안전

const CANONICAL_FULL: Record<Key, string> = {
  tight:  '🚫 생활비도 빠듯해 기본적인 지출이 어렵다',
  basic:  '🧾 기본 생활비는 가능한 수준이다',
  some:   '👜 여유 있게 쓰고 약간의 소비도 가능하다',
  plenty: '🎯 원하는 취미나 자기계발에도 충분히 투자할 수 있다',
};

const OPTIONS: { key: Key; emoji: string; uiLabel: string }[] = [
  { key: 'tight',  emoji: '🚫', uiLabel: '생활비가 빠듯해서 기본적인 지출도 벅차요' },
  { key: 'basic',  emoji: '🧾', uiLabel: '기본적인 생활비는 감당할 수 있어요' },
  { key: 'some',   emoji: '👜', uiLabel: '생활비에 여유가 있어 약간의 소비도 가능해요' },
  { key: 'plenty', emoji: '🎯', uiLabel: '취미나 자기계발에도 충분히 투자할 수 있을 만큼 여유로워요' },
];

const PRIMARY = '#4E41FF';

export default function EconomySpendingScreen() {
  const { data, chooseSpending } = useSurvey();
  const { from } = useLocalSearchParams<{ from?: 'confirm' }>();

  const [selected, setSelected] = useState<Key | null>(() => {
    const entry = Object.entries(CANONICAL_FULL).find(([, full]) => full === data.spendingFull);
    return (entry?.[0] as Key) ?? null;
  });
  const [error, setError] = useState<string | null>(null);

  // ⬅️ TS2345 해결: 라우트 리터럴 유니온으로 제한
  const goNext = (next: RoutePath) => {
    if (from === 'confirm') {
      router.replace(ROUTES.confirm); // 수정 모드면 확인 화면 복귀
    } else {
      router.push(next);              // 일반 흐름이면 다음 단계
    }
  };

  const onNext = () => {
    if (!selected) { setError('질문에 응답해 주세요'); return; }
    setError(null);
    chooseSpending(CANONICAL_FULL[selected]);
    goNext(ROUTES.relationship);
  };

  return (
    <QuestionWrapper
      question="현재 생활비 지출에 대한 만족도는 어떤가요?"
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
  // QuestionWrapper의 paddingLeft: 8 과 좌우 라인업 맞춤
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
  emoji: { fontSize: 16 },
  emojiActive: { transform: [{ scale: 1.02 }] },

  cardText: {
  flex: 1,                    // ⬅️ 남은 가로폭 다 쓰기
  minWidth: 0,                // ⬅️ 수축 허용(안 넣으면 줄바꿈 안될 때가 있음)
  flexShrink: 1,              // ⬅️ 줄바꿈 위해 수축 허용
  textAlign: 'left',          // ⬅️ 멀티라인 가독성
  lineHeight: 22,             // ⬅️ 줄 간격
  fontSize: 16,
  color: '#111',
},
  
  cardTextActive: { color: PRIMARY, fontWeight: '700' },
});
