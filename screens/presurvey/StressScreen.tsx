// screens/presurvey/StressScreen.tsx
import { router, useLocalSearchParams } from 'expo-router'; // ⬅ 추가
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';
import { ROUTES, useSurvey } from './survey-context';

const PRIMARY = '#4E41FF';

const OPTIONS = [
  '✨ 운동이나 산책 같은 신체 활동을 해요',
  '💡 음악을 듣거나 영화를 보며 혼자만의 시간을 보내요',
  '🗣️ 가족이나 친구와 대화하면서 스트레스를 풀어요',
  '😶 뚜렷한 해소 방법이 없어서 그냥 버티는 편이에요',
] as const;

export default function StressScreen() {
  const { data, chooseStress } = useSurvey();
  const { from } = useLocalSearchParams<{ from?: 'confirm' }>(); // ⬅ 추가

  const initialIndex = useMemo(
    () => (data.stressFull ? OPTIONS.findIndex((v) => v === data.stressFull) : -1),
    [data.stressFull]
  );

  const [selected, setSelected] = useState<number | null>(initialIndex >= 0 ? initialIndex : null);
  const [error, setError] = useState<string | null>(null);

  // 공통 이동 함수
  const goNext = (next: (typeof ROUTES)[keyof typeof ROUTES]) => {
    if (from === 'confirm') {
      router.replace(ROUTES.confirm); // 수정 모드면 바로 Confirm 복귀
    } else {
      router.push(next); // 일반 모드면 다음 단계
    }
  };

  const onNext = () => {
    if (selected === null) {
      setError('하나를 선택해 주세요.');
      return;
    }
    setError(null);
    chooseStress(OPTIONS[selected]);
    goNext(ROUTES.confirm); // ✅ 교체
  };

  return (
    <QuestionWrapper
      question="스트레스를 받을 때, 당신은 주로 어떻게 해소하나요?"
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
