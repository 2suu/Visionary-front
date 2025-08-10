// screens/presurvey/EducationScreen.tsx
import { router, useLocalSearchParams } from 'expo-router'; // ⬅ 추가
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';
import { ROUTES, useSurvey } from './survey-context';

const OPTIONS = [
  '🏫 중학교 졸업 이하',
  '🎓 고등학교 졸업',
  '🧑‍🎓 2~3년제 대학교 졸업',
  '🎓 4년제 대학교 졸업',
  '📚 대학원 이상',
] as const;
type UiEdu = (typeof OPTIONS)[number];

const PRIMARY = '#4E41FF';

export default function EducationScreen() {
  const { data, setData } = useSurvey();
  const { from } = useLocalSearchParams<{ from?: 'confirm' }>(); // ⬅ 추가

  // 저장값 → UI 라벨 역매핑
  const initialUi = useMemo<UiEdu | null>(() => {
    if (!data.education) return null;
    switch (data.education) {
      case '중학교 졸업 이하': return '🏫 중학교 졸업 이하';
      case '고등학교 졸업': return '🎓 고등학교 졸업';
      case '2~3년제 대학교 졸업': return '🧑‍🎓 2~3년제 대학교 졸업';
      case '4년제 대학교 졸업': return '🎓 4년제 대학교 졸업';
      case '대학원 이상': return '📚 대학원 이상';
      default: return null;
    }
  }, [data.education]);

  const [value, setValue] = useState<UiEdu | null>(initialUi);
  const [error, setError] = useState<string | null>(null);

  // ⬅ 공통 이동 함수
  // 타입 빡세게: const goNext = (next: (typeof ROUTES)[keyof typeof ROUTES]) => { ... }
  const goNext = (next: string) => {
    if (from === 'confirm') {
      router.replace(ROUTES.confirm); // 수정 모드면 Confirm 복귀
    } else {
      router.push(next);              // 일반 흐름이면 다음
    }
  };

  const onNext = () => {
    if (!value) {
      setError('질문에 응답해 주세요');
      return;
    }
    setError(null);

    // UI 라벨 → 저장값(이모지 제거)
    const clean =
      value.endsWith('중학교 졸업 이하') ? '중학교 졸업 이하' :
      value.endsWith('고등학교 졸업') ? '고등학교 졸업' :
      value.endsWith('2~3년제 대학교 졸업') ? '2~3년제 대학교 졸업' :
      value.endsWith('4년제 대학교 졸업') ? '4년제 대학교 졸업' :
      '대학원 이상';

    setData({ education: clean });
    goNext(ROUTES.experience); // ⬅ 교체
  };

  return (
    <QuestionWrapper question="당신의 최종 학력은 어떻게 되나요?" onNext={onNext} error={error}>
      <View style={styles.list}>
        {OPTIONS.map((opt) => {
          const active = value === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.item, active && styles.itemActive]}
              onPress={() => setValue(opt)}
              activeOpacity={0.9}
            >
              <Text style={[styles.itemText, active && styles.itemTextActive]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </QuestionWrapper>
  );
}

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
  itemActive: { borderColor: PRIMARY, backgroundColor: '#F5F3FF', shadowOpacity: 0.12 },
  itemText: { fontSize: 16, color: '#111' },
  itemTextActive: { color: PRIMARY, fontWeight: '700' },
});
