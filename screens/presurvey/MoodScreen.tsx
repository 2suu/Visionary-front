// screens/presurvey/MoodScreen.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';
import { ROUTES, useSurvey } from './survey-context';

const PRIMARY = '#4E41FF';

// 저장에 쓰는 정식 문장(이모지 포함)
const CANONICAL_FULL = [
  '😊 감정이 안정적이고 쉽게 흔들리지 않아요',
  '🙂 약간의 기복은 있지만 스스로 잘 조절해요',
  '😕 기분 변화가 가끔 심한 편이에요',
  '😣 감정 기복이 크고, 컨트롤이 잘 안 될 때도 있어요',
] as const;

// 화면 표시에 쓰는 이모지/라벨 분리
const UI_OPTIONS = [
  { emoji: '😊', uiLabel: '감정이 안정적이고 쉽게 흔들리지 않아요' },
  { emoji: '🙂', uiLabel: '약간의 기복은 있지만 스스로 잘 조절해요' },
  { emoji: '😕', uiLabel: '기분 변화가 가끔 심한 편이에요' },
  { emoji: '😣', uiLabel: '감정 기복이 크고, 컨트롤이 잘 안 될 때도 있어요' },
] as const;

type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export default function MoodScreen() {
  const { data, chooseMood } = useSurvey();
  const { from } = useLocalSearchParams<{ from?: 'confirm' }>();

  const initialIndex = useMemo(
    () => (data.moodFull ? CANONICAL_FULL.findIndex((v) => v === data.moodFull) : -1),
    [data.moodFull]
  );

  const [selected, setSelected] = useState<number | null>(initialIndex >= 0 ? initialIndex : null);
  const [error, setError] = useState<string | null>(null);

  const goNext = (next: RoutePath) => {
    if (from === 'confirm') router.replace(ROUTES.confirm);
    else router.push(next);
  };

  const onNext = () => {
    if (selected === null) {
      setError('하나를 선택해 주세요.');
      return;
    }
    setError(null);
    chooseMood(CANONICAL_FULL[selected]); // 이모지 포함 정식 문장 저장
    goNext(ROUTES.stress);
  };

  return (
    <QuestionWrapper
      question="평소 감정기복(기분변화)은 어떤 편인가요?"
      onNext={onNext}
      error={error}
      nextLabel="다음"
      topPadding={140}        // 요청대로 현재 값 유지
      gapAfterQuestion={24}
    >
      <View style={styles.list}>
        {UI_OPTIONS.map(({ emoji, uiLabel }, idx) => {
          const isOn = selected === idx;
          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.9}
              onPress={() => setSelected(idx)}
              style={[styles.card, isOn && styles.cardOn]}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              accessibilityRole="button"
              accessibilityState={{ selected: isOn }}
            >
              <Text style={[styles.emoji, isOn && styles.emojiOn]}>{emoji}</Text>
              <Text
                style={[styles.cardText, isOn && styles.cardTextOn]}
                textBreakStrategy="balanced" // 안드로이드 줄바꿈 품질
              >
                {uiLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </QuestionWrapper>
  );
}

const styles = StyleSheet.create({
  // QuestionWrapper(paddingLeft: 8)와 좌우 라인업 맞춤
  list: {
    width: '100%',
    paddingHorizontal: 8,
    marginTop: 8,
    rowGap: 12, // RN 0.73+; 미지원이면 card.marginBottom 사용
  },
  card: {
    width: '100%',
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E5ED',
    backgroundColor: 'white',
    flexDirection: 'row',       // ← 이모지 + 텍스트 가로 배치
    alignItems: 'flex-start',   // ← 멀티라인 기준 상단 정렬
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,           // rowGap 미지원 대비
  },
  cardOn: { borderColor: PRIMARY, backgroundColor: '#F2F1FF' },
  emoji: { fontSize: 18, lineHeight: 20, marginTop: 1 },
  emojiOn: { transform: [{ scale: 1.02 }] },
  cardText: {
    flex: 1,                    // 남은 폭 전부 사용
    minWidth: 0,                // 수축 허용(말줄임/줄바꿈 안정화)
    flexShrink: 1,              // 긴 라벨 줄바꿈 허용
    fontSize: 16,
    lineHeight: 22,
    color: '#2A2A35',
    textAlign: 'left',
  },
  cardTextOn: { color: PRIMARY, fontWeight: '700' },
});
