// app/survey/Q46MoneyScreen.tsx
// Q46. 최소 희망연봉 입력

import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import QuestionWrapper from '../../screens/survey/QuestionWrapper';
import { useSurvey } from '../../screens/survey/survey-context';

const PRIMARY = '#4E41FF';

const formatNumber = (numStr: string) => {
  const digits = numStr.replace(/[^\d]/g, '');
  const normalized = digits.replace(/^0+(?=\d)/, '');
  return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export default function Q46MoneyScreen() {
  const { data, setField } = useSurvey();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isEdit = mode === 'edit';

  // ✅ 기존 값 복원 (예: 35000000 → "35,000,000")
  const [raw, setRaw] = useState<string>(
    typeof data.desiredSalaryYear === 'number' ? String(data.desiredSalaryYear) : ''
  );
  const [display, setDisplay] = useState<string>(
    typeof data.desiredSalaryYear === 'number' ? formatNumber(String(data.desiredSalaryYear)) : ''
  );
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (typeof data.desiredSalaryYear === 'number') {
      setRaw(String(data.desiredSalaryYear));
      setDisplay(formatNumber(String(data.desiredSalaryYear)));
    }
  }, [data.desiredSalaryYear]);

  const isValid = useMemo(() => raw.length > 0 && Number(raw) > 0, [raw]);

  const onChange = (text: string) => {
    const digits = text.replace(/[^\d]/g, '');
    setRaw(digits);
    setDisplay(formatNumber(digits));
  };

  const onNext = () => {
    if (!isValid) return;
    setField('desiredSalaryYear', Number(raw));

    if (isEdit) {
      // 수정 모드 → 확인 화면의 '연봉(salary)' 탭으로 복귀
      router.replace('/survey/confirm?tab=salary' as const);
    } else {
      router.replace('/survey/q/47' as const);
    }
  };

  return (
    <QuestionWrapper
      title="Q46. 최소 희망연봉을 입력해주세요."
      progressText="46/47"
      progressPct={(46 / 47) * 100}
      onNext={onNext}       // ✅ 하단 “확인” 버튼 트리거
      disabled={!isValid}   // ✅ 유효성 전까지 비활성화
      // topPadding, gapAfterTitle은 QuestionWrapper 기본값(presurvey 기준) 사용
    >
      <Text style={styles.desc}>
        가장 낮아도 괜찮다고 생각하는 연봉금액을 알려주세요.
      </Text>

      <TextInput
        value={display}
        onChangeText={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="예) 35,000,000"
        placeholderTextColor="#B7B7B7"
        style={[styles.input, focused && styles.inputActive]}
        keyboardType="number-pad"
        returnKeyType="done"
        onSubmitEditing={onNext}
        autoCorrect={false}
        autoCapitalize="none"
        selection={{ start: display.length, end: display.length }} // 커서를 항상 끝으로
      />

      <View style={{ marginTop: 8 }}>
        <Text style={styles.hint}>최소 희망연봉이 3,500만원일 경우</Text>
        <Text style={styles.hintArrow}>{'> '}35,000,000</Text>
      </View>
    </QuestionWrapper>
  );
}

const styles = StyleSheet.create({
  desc: { color: '#666', fontSize: 13, lineHeight: 20, marginTop: 4, marginBottom: 14 },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#DDDDDD',
    paddingVertical: 10,
    fontSize: 18,
    color: '#111',
    minHeight: 42,
  },
  inputActive: { borderBottomColor: PRIMARY },
  hint: { color: '#5E5E5E', fontSize: 12, marginTop: 2 },
  hintArrow: { color: '#5E5E5E', fontSize: 12, marginTop: 2, fontWeight: '600' },
});
