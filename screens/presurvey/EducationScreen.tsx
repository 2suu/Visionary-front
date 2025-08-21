// screens/presurvey/EducationScreen.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';
import { EDUCATION_CODE, ROUTES, useSurvey } from './survey-context';

const OPTIONS = [
  '🏫 중학교 졸업 이하',
  '🎓 고등학교 졸업',
  '🧑‍🎓 2~3년제 대학교 졸업',
  '🎓 4년제 대학교 졸업',
  '📚 대학원 이상',
] as const;
type UiEdu = (typeof OPTIONS)[number];

// ⬅️ ROUTES 값 유니온 타입으로 라우트 안전하게
type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

const PRIMARY = '#4E41FF';

export default function EducationScreen() {
  const { data, setData } = useSurvey();
  const { from } = useLocalSearchParams<{ from?: 'confirm' }>();

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

  // ⬅️ 타입 안전한 이동 함수 (TS 2345 해결)
  const goNext = (next: RoutePath) => {
    if (from === 'confirm') {
      router.replace(ROUTES.confirm); // 수정 모드면 Confirm 복귀
    } else {
      router.push(next);              // 일반 흐름이면 다음
    }
  };

  const onNext = () => {
  if (!value) { setError('질문에 응답해 주세요'); return; }
  setError(null);

  const clean =
    value.endsWith('중학교 졸업 이하') ? '중학교 졸업 이하' :
    value.endsWith('고등학교 졸업') ? '고등학교 졸업' :
    value.endsWith('2~3년제 대학교 졸업') ? '2~3년제 대학교 졸업' :
    value.endsWith('4년제 대학교 졸업') ? '4년제 대학교 졸업' :
    '대학원 이상';

  const code =
    clean === '중학교 졸업 이하' ? 1 :
    clean === '고등학교 졸업' ? 2 :
    clean === '2~3년제 대학교 졸업' ? 3 :
    clean === '4년제 대학교 졸업' ? 4 : 5;

  setData({ education: clean, educationCode: EDUCATION_CODE[clean] }); // ⬅️ 코드 함께 저장
  goNext(ROUTES.experience);
};

  return (
    <QuestionWrapper
      question="당신의 최종 학력은 어떻게 되나요?"
      onNext={onNext}
      error={error}
      topPadding={140}        // 상단 여백
      gapAfterQuestion={24}  // ⬅️ 질문 아래 간격
    >
      <View style={styles.list}>
        {OPTIONS.map((opt) => {
          const active = value === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.item, active && styles.itemActive]}
              onPress={() => setValue(opt)}
              activeOpacity={0.9}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
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
  // QuestionWrapper 내부 paddingLeft: 8과 좌우 정렬 맞춤
  list: {
    width: '100%',
    paddingHorizontal: 8,
    marginTop: 8,
    rowGap: 12,          // RN 0.73+ 지원. 구버전이면 아래 marginBottom 사용
  },
  item: {
    width: '100%',
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
    marginBottom: 12,    // rowGap 미지원일 때 대비
  },
  itemActive: { borderColor: PRIMARY, backgroundColor: '#F5F3FF', shadowOpacity: 0.12 },
  itemText: { fontSize: 16, color: '#111' },
  itemTextActive: { color: PRIMARY, fontWeight: '700' },
});
