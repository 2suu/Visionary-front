// screens/presurvey/EconomySavingScreen.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';

type Opt =
  | '저축할 여유가 없어요'
  | '조금씩이라도 저축하고 있어요'
  | '매달 일정금액 이상 저축하고 있어요'
  | '저축 외에도 투자까지 여유가 있어요';

const OPTIONS: { label: Opt; emoji: string }[] = [
  { label: '저축할 여유가 없어요',          emoji: '🚫' },
  { label: '조금씩이라도 저축하고 있어요',  emoji: '💰' },
  { label: '매달 일정금액 이상 저축하고 있어요', emoji: '📅' },
  { label: '저축 외에도 투자까지 여유가 있어요',  emoji: '📈' },
];

export default function EconomySavingScreen() {
  const [value, setValue] = useState<Opt | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onNext = () => {
    if (!value) { setError('질문에 응답해 주세요'); return; }
    setError(null);
    router.push('/presurvey/economy-spending');
  };

  return (
    <QuestionWrapper question="한 달에 어느 정도 저축이 가능한가요?" onNext={onNext} error={error}>
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