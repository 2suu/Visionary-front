// screens/presurvey/MoodScreen.tsx
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';
import { ROUTES, useSurvey } from './survey-context';

const PRIMARY = '#4E41FF';

// ✅ survey-context의 MOOD_SHORT 매핑과 "완전히 동일"한 정식 문장들
const OPTIONS = [
  '😊 감정이 안정적이고 쉽게 흔들리지 않아요',
  '🙂 약간의 기복은 있지만 스스로 잘 조절해요',
  '😕 기분 변화가 가끔 심한 편이에요',
  '😣 감정 기복이 크고, 컨트롤이 잘 안 될 때도 있어요',
] as const;

export default function MoodScreen() {
  const { data, chooseMood } = useSurvey();

  // 저장된 moodFull이 있으면 그 인덱스로 초기 선택 복원
  const initialIndex = useMemo(
    () => (data.moodFull ? OPTIONS.findIndex((v) => v === data.moodFull) : -1),
    [data.moodFull]
  );

  const [selected, setSelected] = useState<number | null>(initialIndex >= 0 ? initialIndex : null);
  const [error, setError] = useState<string | null>(null);

  const onNext = () => {
    if (selected === null) {
      setError('하나를 선택해 주세요.');
      return;
    }
    setError(null);
    // ✅ 정식 문장 저장 → 컨텍스트에서 짧은 라벨(moodShort) 자동 세팅
    chooseMood(OPTIONS[selected]);
    router.push(ROUTES.stress);
  };

  return (
    <QuestionWrapper
      question="평소 감정기복(기분변화)은 어떤 편인가요?"
      onNext={onNext}
      error={error}
      nextLabel="다음"
      gapAfterQuestion={30}
    >
      <View style={{ gap: 10 }}>
        {OPTIONS.map((label, idx) => {
          const isOn = selected === idx;
          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.9}
              onPress={() => setSelected(idx)}
              style={[styles.card, isOn && styles.cardOn]}
            >
              <Text style={[styles.cardText, isOn && styles.cardTextOn]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </QuestionWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E5ED',
    backgroundColor: 'white',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardOn: { borderColor: PRIMARY, backgroundColor: '#F2F1FF' },
  cardText: { fontSize: 14, lineHeight: 20, color: '#2A2A35' },
  cardTextOn: { color: PRIMARY, fontWeight: '700' },
});
