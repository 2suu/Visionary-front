// app/survey/Q45Screen.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput } from 'react-native';
import QuestionWrapper from '../../screens/survey/QuestionWrapper';
import { useSurvey } from '../../screens/survey/survey-context';

export default function Q45Screen() {
  const { data, setField } = useSurvey();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isEdit = mode === 'edit';

  // 저장된 값 복원
  const [text, setText] = useState(() => (data.interestField ?? '').toString());

  const tokens = useMemo(
    () => text.split(',').map(t => t.trim()).filter(Boolean),
    [text]
  );
  const isValid = tokens.length >= 2 && tokens.length <= 3;

  const onSave = () => {
    if (!isValid) {
      Alert.alert('입력 형식', '콤마(,)로 구분하여 2~3개까지 입력해 주세요.');
      return;
    }
    // 컨텍스트 저장 (ConfirmScreen은 문자열로 표시)
    setField('interestField', tokens.join(', '));

    if (isEdit) {
      // 수정 모드 → 확인 화면의 '관심분야(field)' 탭으로 복귀
      router.replace('/survey/confirm?tab=field' as const);
    } else {
      // 일반 흐름 → 다음 문항
      router.replace('/survey/q/46' as const);
    }
  };

  return (
    <QuestionWrapper
      title="Q45. 진로 선택에 있어 흥미를 느끼는 분야는 무엇인가요?"
      progressText="45/47"
      progressPct={(45 / 47) * 100}
      onNext={onSave}     // ✅ 하단 “확인” 버튼 동작 (presurvey와 동일)
      disabled={!isValid} // ✅ 2~3개가 아닐 경우 버튼 비활성화
      // topPadding, gapAfterTitle은 QuestionWrapper 기본값(=presurvey 기준) 사용
    >
      <Text style={styles.desc}>
        관심 있는 분야를 <Text style={styles.bold}>단답형</Text>으로 작성해주세요.{'\n'}
        콤마(,)로 구분하여 <Text style={styles.bold}>2~3개</Text>까지 적을 수 있습니다.
      </Text>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="예) 인공지능, 마케팅, 영상편집"
        placeholderTextColor="#B7B7B7"
        style={[styles.input, (tokens.length > 0 && !isValid) && styles.inputError]}
        returnKeyType="done"
        onSubmitEditing={onSave} // 엔터로도 저장
        autoCorrect={false}
        autoCapitalize="none"
      />

      <Text style={styles.hint}>답변예시) 인공지능, 마케팅, 영상편집, 출판 등</Text>
    </QuestionWrapper>
  );
}

const styles = StyleSheet.create({
  desc: { color: '#666', fontSize: 13, lineHeight: 20, marginTop: 4, marginBottom: 14 },
  bold: { fontWeight: '700', color: '#444' },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#DDDDDD',
    paddingVertical: 10,
    fontSize: 16,
    color: '#111',
    minHeight: 40,
  },
  inputError: { borderBottomColor: '#E53935' },
  hint: { color: '#8A8A8A', fontSize: 12, marginTop: 8 },
});
