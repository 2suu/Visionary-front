// screens/presurvey/AgeScreen.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';
import { ROUTES, useSurvey } from './survey-context';

const PRIMARY = '#4E41FF';

export default function AgeScreen() {
  const { data, setData } = useSurvey();
  const params = useLocalSearchParams<{ from?: string | string[] }>();
  const from = Array.isArray(params.from) ? params.from[0] : params.from; // ← 안전하게 정규화

  const [age, setAge] = useState<string>(data.age ? String(data.age) : '');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
  }, []);

  // ROUTES 값만 허용
  const goNext = (nextRoute: (typeof ROUTES)[keyof typeof ROUTES]) => {
    if (from === 'confirm') {
      router.replace(ROUTES.confirm);
    } else {
      router.push(nextRoute);
    }
  };

  const onNext = () => {
    const n = Number(age);
    if (!age || !Number.isFinite(n) || n <= 0 || n > 120) {
      setError('질문에 응답해 주세요');
      inputRef.current?.focus();
      return;
    }
    setError(null);
    setData({ age: n });
    Keyboard.dismiss();
    goNext(ROUTES.gender);
  };

  return (
    <QuestionWrapper
      question="당신의 나이를 알려주세요"
      onNext={onNext}
      error={error}
      topPadding={140}        // 상단 여백
      gapAfterQuestion={24}  // 질문 아래 간격
    >
      <View style={styles.row}>
        <TextInput
          ref={inputRef}
          value={age}
          onChangeText={(t) => setAge(t.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
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
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',  // 밑줄 기준 정렬
    width: '100%',
    paddingHorizontal: 8,
    marginTop: 16,  
  },
  input: {
    flex: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: PRIMARY,
    paddingVertical: 10,
    fontSize: 18,
    marginRight: 8,
  },
  suffix: {
    fontSize: 16,
    color: '#444',
    paddingBottom: 10,       // 밑줄 라인과 자연스럽게
  },
});
