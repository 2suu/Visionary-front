// screens/presurvey/EducationScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';
// 다음 화면 연결은 나중 단계에서 router.push로 교체
import { router } from 'expo-router';

const OPTIONS = [
  '🏫 중학교 졸업 이하',
  '🎓 고등학교 졸업',
  '🧑‍🎓 2~3년제 대학교 졸업',
  '🎓 4년제 대학교 졸업',
  '📚 대학원 이상',
] as const;

type Edu = (typeof OPTIONS)[number];

export default function EducationScreen() {
  const [value, setValue] = useState<Edu | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onNext = () => {
    if (!value) {
      setError('질문에 응답해 주세요');
      return;
    }
    setError(null);
    // TODO: 다음 화면 연결
    // router.push('/presurvey/experience');
    router.back(); // 임시 (확인용)
  };

  return (
    <QuestionWrapper question="당신의 최종 학력은 어떻게 되나요?" onNext={onNext} error={error}>
      <View style={styles.list}>
        {OPTIONS.map((opt) => {
          const active = value === opt;
          return (
            <TouchableOpacity key={opt} style={[styles.item, active && styles.itemActive]} onPress={() => setValue(opt)}>
              <Text style={[styles.itemText, active && styles.itemTextActive]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </QuestionWrapper>
  );
}

const PRIMARY = '#4E41FF';

const styles = StyleSheet.create({
  list: { width: '100%', marginTop: 8, gap: 12 },
  item: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  itemActive: { borderColor: PRIMARY, shadowOpacity: 0.12 },
  itemText: { fontSize: 16, color: '#111' },
  itemTextActive: { color: PRIMARY, fontWeight: '700' },
});
