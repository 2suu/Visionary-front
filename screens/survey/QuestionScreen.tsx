import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import Likert from './Likert';
import { LIKERT_QUESTIONS, TOTAL_QUESTIONS } from './questions';
import QuestionWrapper from './QuestionWrapper';
import { useProgress, useSurvey } from './survey-context';

// 문항 번호 → 탭 매핑 (ConfirmScreen과 동일)
type TabKey = 'trait' | 'interest' | 'field' | 'salary' | 'priority';
const tabByNo = (no: number): TabKey => {
  if (no >= 1 && no <= 20) return 'trait';
  if (no >= 21 && no <= 44) return 'interest';
  if (no === 45) return 'field';
  if (no === 46) return 'salary';
  return 'priority'; // 47
};

export default function LikertQuestion() {
  // no, mode, retTab 쿼리 파라미터
  const { no, mode, retTab } = useLocalSearchParams<{
    no?: string | string[];
    mode?: string | string[];
    retTab?: string | string[];
  }>();

  // no → idx (1~44로 클램핑)
  const noStr = Array.isArray(no) ? no[0] : no ?? '1';
  const parsed = Number.parseInt(noStr, 10);
  const idx = Math.max(1, Math.min(44, Number.isNaN(parsed) ? 1 : parsed));

  const editMode = (Array.isArray(mode) ? mode[0] : mode) === 'edit';
  const rawRet = Array.isArray(retTab) ? retTab[0] : retTab;
  const safeTab: TabKey =
    rawRet === 'trait' || rawRet === 'interest' || rawRet === 'field' || rawRet === 'salary' || rawRet === 'priority'
      ? (rawRet as TabKey)
      : tabByNo(idx); // 폴백: 현재 문항 기준

  const { data, setLikert } = useSurvey();
  const question = LIKERT_QUESTIONS[idx - 1];
  const currentValue = (data.likert ?? [])[idx - 1] ?? undefined; // 안전 접근

  const { pct } = useProgress(idx); // 1~47 기준 진행도

  const goNext = () => {
    if (!currentValue) {
      Alert.alert('선택 필요', '1~5 중 하나를 선택해주세요.');
      return;
    }

    if (editMode) {
      // 편집 모드: 해당 탭으로 복귀
      router.replace({ pathname: '/survey/confirm', params: { tab: safeTab } });
      return;
    }

    // 일반 진행
    if (idx < 44) {
      router.replace({ pathname: '/survey/q/[no]', params: { no: String(idx + 1) } });
    } else {
      router.replace({ pathname: '/survey/q/[no]', params: { no: '45' } });
    }
  };

  return (
    <QuestionWrapper
      title={`Q${idx}. ${question}`}
      progressText={`${idx}/${TOTAL_QUESTIONS}`}
      progressPct={pct}
      disabled={!currentValue}
      onNext={goNext}
    >
      <Likert value={currentValue} onChange={(v) => setLikert(idx, v)} />
    </QuestionWrapper>
  );
}
