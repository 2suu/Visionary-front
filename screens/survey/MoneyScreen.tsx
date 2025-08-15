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
    // 컨텍스트 갱신에 따라 외부에서 값이 바뀐 경우도 동기화
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
    // ✅ 컨텍스트에 저장 (정수 원화 금액)
    setField('desiredSalaryYear', Number(raw));

    // ✅ 수정 모드면 확인 화면으로, 아니면 다음 문항
    if (isEdit) {
      router.replace('/survey/confirm' as const);
    } else {
      router.replace('/survey/q/47' as const);
    }
  };

  return (
    <QuestionWrapper
      title="Q46. 최소 희망연봉을 입력해주세요."
      progressText="46/47"
      progressPct={(46 / 47) * 100}
      onNext={onNext}          // 하단 “확인”이 저장 트리거
      disabled={!isValid}
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
        // 커서를 항상 끝으로 (간단 안정 버전)
        selection={{ start: display.length, end: display.length }}
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
