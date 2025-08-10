// screens/presurvey/GenderScreen.tsx
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';
import { ROUTES, useSurvey } from './survey-context';

const OPTIONS = ['♂️ 남자', '♀️ 여자', '🔒 밝히고 싶지 않음'] as const;
type UiGender = (typeof OPTIONS)[number];

const PRIMARY = '#4E41FF';

export default function GenderScreen() {
  const { data, setData } = useSurvey();

  // 저장된 값(남자/여자/밝히고 싶지 않음)을 UI 라벨(이모지 포함)로 역매핑해서 초기 선택 복원
  const initialUi = useMemo<UiGender | null>(() => {
    if (!data.gender) return null;
    switch (data.gender) {
      case '남자': return '♂️ 남자';
      case '여자': return '♀️ 여자';
      case '밝히고 싶지 않음': return '🔒 밝히고 싶지 않음';
      default: return null;
    }
  }, [data.gender]);

  const [value, setValue] = useState<UiGender | null>(initialUi);
  const [error, setError] = useState<string | null>(null);

  const onNext = () => {
    if (!value) {
      setError('질문에 응답해 주세요');
      return;
    }
    setError(null);

    // UI 라벨 → 저장값(이모지 제거)
    const clean =
      value === '♂️ 남자' ? '남자' :
      value === '♀️ 여자' ? '여자' :
      '밝히고 싶지 않음';

    setData({ gender: clean });
    router.push(ROUTES.education);
  };

  return (
    <QuestionWrapper question="당신의 성별을 알려주세요" onNext={onNext} error={error}>
      <View style={styles.grid}>
        {OPTIONS.map((opt) => {
          const active = value === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => setValue(opt)}
              activeOpacity={0.9}
            >
              <Text style={[styles.cardText, active && styles.cardTextActive]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </QuestionWrapper>
  );
}

const styles = StyleSheet.create({
  grid: { width: '100%', marginTop: 8, gap: 12, alignItems: 'center' },
  card: {
    width: '90%',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardActive: { borderColor: PRIMARY, backgroundColor: '#F5F3FF', shadowOpacity: 0.12 },
  cardText: { fontSize: 16, color: '#111' },
  cardTextActive: { color: PRIMARY, fontWeight: '700' },
});
