// screens/presurvey/RelationshipScreen.tsx
import { router } from 'expo-router';
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

export default function RelationshipScreen() {
  const { data, setData } = useSurvey();

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

    router.push(ROUTES.mood);
  };

  return (
    <QuestionWrapper
      question="본인의 대인관계 스타일은 어떤가요?"
      onNext={onNext}
      error={error}
      nextLabel="확인"
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
            >
              <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>
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
  questionLabel: { fontSize: 15, fontWeight: '600', color: '#111', marginBottom: 14 },

  // Q1: 동그라미 3개 + 라벨
  q1Row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingHorizontal: 6,
    marginBottom: 35,
  },
  q1Item: { alignItems: 'center', gap: 8 },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CFCFD6',
    backgroundColor: 'white',
  },
  circleSelected: { borderColor: PRIMARY, backgroundColor: PRIMARY },
  q1Text: { fontSize: 13, color: '#4A4A55' },
  q1TextSelected: { color: '#2A2A35', fontWeight: '700' },

  // Q2: 두 개 버튼
  q2Row: { flexDirection: 'row', gap: 10, marginTop: 12 },
  choiceBtn: {
    flex: 1,
    height: 44,
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
  },
  choiceBtnSelected: {
    borderColor: PRIMARY,
    backgroundColor: '#F2F1FF',
    shadowOpacity: 0.08,
  },
  choiceText: { fontSize: 14, color: '#2A2A35' },
  choiceTextSelected: { color: PRIMARY, fontWeight: '700' },
});
