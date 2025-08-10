// screens/presurvey/ExperienceScreen.tsx
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';
import { ROUTES, useSurvey } from './survey-context';

type Ans = '예 (경력 있어요)' | '아니오 (경력 없어요)';

const PRIMARY = '#4E41FF';

export default function ExperienceScreen() {
  const { data, setData } = useSurvey();

  // ✅ 저장된 hasExperience로 초기 선택 복원
  const initialUi = useMemo<Ans | null>(() => {
    if (data.hasExperience === true) return '예 (경력 있어요)';
    if (data.hasExperience === false) return '아니오 (경력 없어요)';
    return null;
  }, [data.hasExperience]);

  const [value, setValue] = useState<Ans | null>(initialUi);
  const [error, setError] = useState<string | null>(null);

  const onNext = () => {
    if (!value) {
      setError('질문에 응답해 주세요');
      return;
    }
    setError(null);

    const yes = value.startsWith('예');
    setData({
      hasExperience: yes,
      // ❗ '아니오' 선택하면 이전 상세 입력을 정리
      ...(yes ? {} : { experiences: [] }),
    });

    router.push(yes ? ROUTES.experienceDetail : ROUTES.economySaving);
  };

  return (
    <QuestionWrapper question="경력(인턴경험 포함)이 있으신가요?" onNext={onNext} error={error}>
      <View style={styles.list}>
        {([
          { label: '예 (경력 있어요)', emoji: '🔵' },
          { label: '아니오 (경력 없어요)', emoji: '❌' },
        ] as { label: Ans; emoji: string }[]).map(({ label, emoji }) => {
          const active = value === label;
          return (
            <TouchableOpacity
              key={label}
              onPress={() => setValue(label)}
              activeOpacity={0.9}
              style={[styles.card, active && styles.cardActive]}
            >
              <Text style={[styles.emoji, active && styles.emojiActive]}>{emoji}</Text>
              <Text style={[styles.cardText, active && styles.cardTextActive]}>{label}</Text>
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
  },
  cardActive: {
    borderColor: PRIMARY,
    shadowOpacity: 0.12,
    backgroundColor: '#F5F3FF',
  },
  emoji: { fontSize: 18 },
  emojiActive: { transform: [{ scale: 1.02 }] },
  cardText: { fontSize: 16, color: '#111' },
  cardTextActive: { color: PRIMARY, fontWeight: '700' },
});
