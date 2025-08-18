// screens/presurvey/RelationshipScreen.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';
import { ROUTES, useSurvey } from './survey-context';

const PRIMARY = '#4E41FF';
const Q1_OPTIONS = ['없음', '보통', '활발'] as const;
const Q2_OPTIONS = [
  { label: '깊고 좁게', emoji: '👥' },
  { label: '넓고 얕게', emoji: '🌐' },
] as const;

// ⬅️ router.push 인자 타입 유니온(TS2345 해결)
type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export default function RelationshipScreen() {
  const { data, setData } = useSurvey();
  const { from } = useLocalSearchParams<{ from?: 'confirm' }>();

  // ✅ 수정모드 분기: 저장 후 확인화면으로 복귀 / 일반흐름은 다음 화면으로
  const goNext = (nextRoute: RoutePath) => {
    if (from === 'confirm') router.replace(ROUTES.confirm);
    else router.push(nextRoute);
  };

  // ✅ Confirm에서 편집으로 들어왔을 때, 저장된 값을 기준으로 초기 선택 복원
  const initialIdxQ1 = useMemo(
    () => (data.relationFreq ? Q1_OPTIONS.findIndex((v) => v === data.relationFreq) : -1),
    [data.relationFreq]
  );
  const initialIdxQ2 = useMemo(
    () => (data.relationStyle ? Q2_OPTIONS.findIndex((v) => v.label === data.relationStyle) : -1),
    [data.relationStyle]
  );

  const [q1, setQ1] = useState<number | null>(initialIdxQ1 >= 0 ? initialIdxQ1 : null);
  const [q2, setQ2] = useState<number | null>(initialIdxQ2 >= 0 ? initialIdxQ2 : null);
  const [error, setError] = useState<string | null>(null);

  const onNext = () => {
    if (q1 === null || q2 === null) {
      setError('질문에 응답해 주세요.');
      return;
    }
    setError(null);

    // ✅ Context 저장
    setData({
      relationFreq: Q1_OPTIONS[q1],
      relationStyle: Q2_OPTIONS[q2].label,
    });

    goNext(ROUTES.mood);
  };

  return (
    <QuestionWrapper
      question="본인의 대인관계 스타일은 어떤가요?"
      onNext={onNext}
      error={error}
      nextLabel="확인"
      topPadding={140}        // 상단 여백
      gapAfterQuestion={24}
    >
      {/* Q1 */}
      <Text style={[styles.questionLabel, { marginTop: 20 }]}>
        Q1. 평소 사람들과의 교류는 얼마나 자주 하시나요?
      </Text>
      <View style={styles.q1Row}>
        {Q1_OPTIONS.map((label, idx) => {
          const selected = q1 === idx;
          return (
            <TouchableOpacity
              key={label}
              style={styles.q1Item}
              onPress={() => setQ1(idx)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <View style={[styles.circle, selected && styles.circleSelected]} />
              <Text style={[styles.q1Text, selected && styles.q1TextSelected]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Q2 */}
      <Text style={[styles.questionLabel, { marginTop: 20 }]}>
        Q2. 어떤 대인관계 스타일을 더 선호하나요?
      </Text>
      <View style={styles.q2Row}>
        {Q2_OPTIONS.map((opt, idx) => {
          const selected = q2 === idx;
          return (
            <TouchableOpacity
              key={opt.label}
              style={[styles.choiceBtn, selected && styles.choiceBtnSelected]}
              onPress={() => setQ2(idx)}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Text
                style={[styles.choiceText, selected && styles.choiceTextSelected]}
                textBreakStrategy="balanced"
              >
                {opt.emoji}  {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </QuestionWrapper>
  );
}

const styles = StyleSheet.create({
   questionLabel: {
   fontSize: 16,
   fontWeight: '600',
   color: '#111',
   marginBottom: 14,
   alignSelf: 'stretch',
   paddingHorizontal: 8,   // ← 메인 질문(paddingLeft:8)과 좌우 라인업
  },

  // Q1: 동그라미 3개 + 라벨
  q1Row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingHorizontal: 8,       // ⬅️ QuestionWrapper 좌우 패딩과 라인업
    marginBottom: 35,
  },
  q1Item: { alignItems: 'center', gap: 8, marginHorizontal: 15, },
  circle: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#CFCFD6', backgroundColor: 'white',
  },
  circleSelected: { borderColor: PRIMARY, backgroundColor: PRIMARY },
  q1Text: { fontSize: 16, color: '#4A4A55' },
  q1TextSelected: { color: '#2A2A35', fontWeight: '700' },

  // Q2: 두 개 버튼
   q2Row: { flexDirection: 'row', gap: 10, marginTop: 12, paddingHorizontal: 8 },
   choiceBtn: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#D9D9E1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  choiceBtnSelected: {
    borderColor: PRIMARY,
    backgroundColor: '#F2F1FF',
    shadowOpacity: 0.08,
  },
  choiceText: {
    fontSize: 16,
    color: '#2A2A35',
    textAlign: 'center',
    lineHeight: 20,
    flexShrink: 1,         // ⬅️ 긴 라벨 줄바꿈 허용
    minWidth: 0,           // ⬅️ 수축 허용(줄바꿈에 필요)
  },
  choiceTextSelected: { color: PRIMARY, fontWeight: '700' },
});
