// screens/presurvey/AgeScreen.tsx
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';
import { ROUTES, useSurvey } from './survey-context';

const PRIMARY = '#4E41FF';

export default function AgeScreen() {
  const { data, setData } = useSurvey();
  const [age, setAge] = useState<string>(data.age ? String(data.age) : '');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // 화면 진입 시 포커스 (선택)
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
  }, []);

  const onNext = () => {
    const n = Number(age);
    if (!age || !Number.isFinite(n) || n <= 0 || n > 120) {
      setError('질문에 응답해 주세요');
      inputRef.current?.focus();
      return;
    }
    setError(null);
    setData({ age: n });         // ✅ Context에 저장
    Keyboard.dismiss();
    router.push(ROUTES.gender);  // ✅ 하드코딩 대신 ROUTES 사용
  };

  return (
    <QuestionWrapper question="당신의 나이를 알려주세요" onNext={onNext} error={error}>
      <View style={styles.row}>
        <TextInput
          ref={inputRef}
          value={age}
          onChangeText={(t) => setAge(t.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"        // iOS/Android 숫자패드
          placeholder="나이"
          placeholderTextColor="#D4D4D4"
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={onNext}
        />
        <Text style={styles.suffix}>살</Text>
      </View>
    </QuestionWrapper>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 32, width: '100%', paddingHorizontal: 8 },
  input: {
    flex: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: PRIMARY,
    paddingVertical: 10,
    fontSize: 18,
    marginRight: 8,
  },
  suffix: { fontSize: 16, color: '#444' },
});
