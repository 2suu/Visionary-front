// screens/presurvey/GenderScreen.tsx
import { router, useLocalSearchParams } from 'expo-router'; // ⬅ 추가
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';
import { ROUTES, useSurvey } from './survey-context';

const OPTIONS = ['♂️ 남자', '♀️ 여자', '🔒 밝히고 싶지 않음'] as const;
type UiGender = (typeof OPTIONS)[number];
// 선택: 타입 안전하게
type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

const PRIMARY = '#4E41FF';

export default function GenderScreen() {
  const { data, setData } = useSurvey();
  const { from } = useLocalSearchParams<{ from?: 'confirm' }>(); // ⬅ 추가

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

  // 공통 이동 함수
  const goNext = (next: RoutePath) => {
    if (from === 'confirm') {
      router.replace(ROUTES.confirm);  // 수정 모드 → Confirm 복귀
    } else {
      router.push(next);               // 일반 흐름 → 다음 화면
    }
  };

  const onNext = () => {
    if (!value) { setError('질문에 응답해 주세요'); return; }
    setError(null);

    const clean =
      value === '♂️ 남자' ? '남자' :
      value === '♀️ 여자' ? '여자' :
      '밝히고 싶지 않음';

    setData({ gender: clean });
    goNext(ROUTES.education); // ✅ 교체
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
