// screens/presurvey/EconomySpendingScreen.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';

type Opt =
  | '생활비가 빠듯해서 기본적인 지출도 벅차요'
  | '기본적인 생활비는 감당할 수 있어요'
  | '생활비에 여유가 있어 약간의 소비도 가능해요'
  | '취미나 자기계발에도 충분히 투자할 수 있을 만큼 여유로워요';

const OPTIONS: { label: Opt; emoji: string }[] = [
  { label: '생활비가 빠듯해서 기본적인 지출도 벅차요',             emoji: '🚫' },
  { label: '기본적인 생활비는 감당할 수 있어요',                    emoji: '🧾' },
  { label: '생활비에 여유가 있어 약간의 소비도 가능해요',           emoji: '👜' },
  { label: '취미나 자기계발에도 충분히 투자할 수 있을 만큼 여유로워요', emoji: '🎯' },
];

export default function EconomySpendingScreen() {
  const [value, setValue] = useState<Opt | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onNext = () => {
    if (!value) { setError('질문에 응답해 주세요'); return; }
    setError(null);
    router.push('/presurvey/relationship'); // 다음 단계 연결 위치
  };

  return (
    <QuestionWrapper question="현재 생활비 지출에 대한 만족도는 어떤가요?" onNext={onNext} error={error}>
      <View style={styles.list}>
        {OPTIONS.map(({ label, emoji }) => {
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

const PRIMARY = '#4E41FF';
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