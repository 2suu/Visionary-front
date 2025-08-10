// screens/presurvey/AgeScreen.tsx
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';

export default function AgeScreen() {
  const [age, setAge] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  const onNext = () => {
    const n = Number(age);
    if (!age || !Number.isFinite(n) || n <= 0 || n > 120) {
      setError('질문에 응답해 주세요');
      inputRef.current?.focus();
      return;
    }
    setError(null);
    router.push('/presurvey/gender');
  };

  return (
    <QuestionWrapper question="당신의 나이를 알려주세요" onNext={onNext} error={error}>
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

const PRIMARY = '#4E41FF';

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