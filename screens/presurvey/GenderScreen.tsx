// screens/presurvey/GenderScreen.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';

const OPTIONS = ['♂️ 남자', '♀️ 여자', '🔒 밝히고 싶지 않음'] as const;
type Gender = (typeof OPTIONS)[number];

export default function GenderScreen() {
  const [value, setValue] = useState<Gender | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onNext = () => {
    if (!value) {
      setError('질문에 응답해 주세요');
      return;
    }
    setError(null);
    router.push('/presurvey/education');
  };

  return (
    <QuestionWrapper question="당신의 성별을 알려주세요" onNext={onNext} error={error}>
      <View style={styles.grid}>
        {OPTIONS.map((opt) => {
          const active = value === opt;
          return (
            <TouchableOpacity key={opt} style={[styles.card, active && styles.cardActive]} onPress={() => setValue(opt)}>
              <Text style={[styles.cardText, active && styles.cardTextActive]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </QuestionWrapper>
  );
}

const PRIMARY = '#4E41FF';

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
  cardActive: { borderColor: PRIMARY, shadowOpacity: 0.12 },
  cardText: { fontSize: 16, color: '#111' },
  cardTextActive: { color: PRIMARY, fontWeight: '700' },
});