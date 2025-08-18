// screens/presurvey/GenderScreen.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';
import { ROUTES, useSurvey } from './survey-context';

const OPTIONS = ['남자', '여자', '밝히고 싶지 않음'] as const;
type UiGender = (typeof OPTIONS)[number];
type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

const PRIMARY = '#4E41FF';

export default function GenderScreen() {
  const { data, setData } = useSurvey();
  const { from } = useLocalSearchParams<{ from?: 'confirm' }>();

  const initialUi = useMemo<UiGender | null>(() => {
    if (!data.gender) return null;
    switch (data.gender) {
      case '남자': return '남자';
      case '여자': return '여자';
      case '밝히고 싶지 않음': return '밝히고 싶지 않음';
      default: return null;
    }
  }, [data.gender]);

  const [value, setValue] = useState<UiGender | null>(initialUi);
  const [error, setError] = useState<string | null>(null);

  const goNext = (next: RoutePath) => {
    if (from === 'confirm') {
      router.replace(ROUTES.confirm);
    } else {
      router.push(next);
    }
  };

  const onNext = () => {
    if (!value) { setError('질문에 응답해 주세요'); return; }
    setError(null);

    const clean =
      value === '남자' ? '남자' :
      value === '여자' ? '여자' :
      '밝히고 싶지 않음';

    setData({ gender: clean });
    goNext(ROUTES.education);
  };

  return (
    <QuestionWrapper
      question="당신의 성별을 알려주세요"
      onNext={onNext}
      error={error}
      topPadding={140}        // 상단 여백
      gapAfterQuestion={24}  // ⬅️ 질문 아래 간격
    >
      <View style={styles.grid}>
        {OPTIONS.map((opt) => {
          const active = value === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => setValue(opt)}
              activeOpacity={0.9}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
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
  // QuestionWrapper의 paddingLeft: 8과 좌우 라인업 맞춤
  grid: {
    width: '100%',
    paddingHorizontal: 8,
    marginTop: 8,
    rowGap: 12,            // RN 0.73+ 지원. 구버전이면 대신 marginBottom 사용
  },
  card: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,      // rowGap 미지원일 때 대비
  },
  cardActive: {
    borderColor: PRIMARY,
    backgroundColor: '#F5F3FF',
    shadowOpacity: 0.12,
  },
  cardText: { fontSize: 17, color: '#111' },
  cardTextActive: { color: PRIMARY, fontWeight: '700' },
});
