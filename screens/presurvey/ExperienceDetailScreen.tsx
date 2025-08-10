// screens/presurvey/ExperienceDetailScreen.tsx
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';

type Row = { field: string; years: string; months: string };

export default function ExperienceDetailScreen() {
  const [rows, setRows] = useState<Row[]>([{ field: '', years: '', months: '' }]);
  const [error, setError] = useState<string | null>(null);
  const fieldRef0 = useRef<TextInput>(null);

  const addRow = () => {
    if (rows.length >= 2) return;
    setRows((r) => [...r, { field: '', years: '', months: '' }]);
  };

  const update = (idx: number, key: keyof Row, val: string) => {
    setRows((r) => r.map((row, i) => (i === idx ? { ...row, [key]: val } : row)));
  };

  const valid = (r: Row) => {
    const y = Number(r.years);
    const m = Number(r.months);
    const yOk = Number.isFinite(y) && y >= 0 && y <= 50;
    const mOk = Number.isFinite(m) && m >= 0 && m <= 11;
    return r.field.trim().length > 0 && (yOk || mOk); // 둘 중 하나라도 입력되면 OK
  };

  const onNext = () => {
    if (!rows.some(valid)) {
      setError('최소 1개 이상, 경력분야와 근무기간(년차/개월)을 입력해 주세요.');
      fieldRef0.current?.focus();
      return;
    }
    setError(null);
    // const payload = rows.filter(valid)
    router.push('/presurvey/economy-saving');
  };

  return (
    <QuestionWrapper
      question="경력이 있으시다면, 어떤 분야에서 몇 년 차이신가요?"
      onNext={onNext}
      error={error}
    >
      <View style={styles.helperBox}>
        <Text style={styles.helperText}>인턴 또는 정규직으로 근무한 분야만 입력 가능합니다.</Text>
        <Text style={styles.helperText}>경력은 최대 2개까지 작성할 수 있습니다.</Text>
        <Text style={styles.example}>작성예시)  경력분야 데이터분석 인턴  /  근무기간 0년차 6개월</Text>
      </View>

      <View style={{ width: '100%', gap: 12 }}>
        {rows.map((row, idx) => (
          <View key={idx} style={styles.card}>
            {/* 경력분야 */}
            <Text style={styles.label}>경력분야</Text>
            <TextInput
              ref={idx === 0 ? fieldRef0 : undefined}
              value={row.field}
              onChangeText={(t) => update(idx, 'field', t)}
              placeholder="단답형으로 적어주세요."
              placeholderTextColor="#D4D4D4"
              style={styles.fieldInput}
              returnKeyType="next"
            />

            {/* 근무기간 */}
            <Text style={[styles.label, { marginTop: 10 }]}>근무기간</Text>
            <View style={styles.periodRow}>
              <TextInput
                value={row.years}
                onChangeText={(t) => update(idx, 'years', t.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                placeholder="숫자"
                placeholderTextColor="#D4D4D4"
                style={[styles.numberInput, { marginRight: 6 }]}
                returnKeyType="done"
              />
              <Text style={styles.suffix}>년차</Text>

              <TextInput
                value={row.months}
                onChangeText={(t) => update(idx, 'months', t.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                placeholder="숫자"
                placeholderTextColor="#D4D4D4"
                style={[styles.numberInput, { marginLeft: 14, marginRight: 6 }]}
                returnKeyType="done"
              />
              <Text style={styles.suffix}>개월</Text>
            </View>
          </View>
        ))}

        {/* 추가 버튼 (2개까지) */}
        {rows.length < 2 && (
          <TouchableOpacity onPress={addRow} style={styles.addBtn} activeOpacity={0.9}>
            <Text style={styles.addText}>+ 경력추가</Text>
          </TouchableOpacity>
        )}
      </View>
    </QuestionWrapper>
  );
}

const PRIMARY = '#4E41FF';

const styles = StyleSheet.create({
  helperBox: { width: '100%', marginBottom: 8 },
  helperText: { fontSize: 12, color: '#666', marginBottom: 2 },
  example: { fontSize: 12, color: '#888', marginTop: 4 },

  card: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  label: { fontSize: 13, color: '#444', marginBottom: 6 },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFF',
  },

  periodRow: { flexDirection: 'row', alignItems: 'center' },
  numberInput: {
    flexGrow: 1,
    maxWidth: 110,
    borderBottomWidth: 1.5,
    borderBottomColor: PRIMARY,
    paddingVertical: 6,
    fontSize: 16,
    textAlign: 'center',
  },
  suffix: { fontSize: 14, color: '#555' },

  addBtn: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 6,
  },
  addText: { color: PRIMARY, fontWeight: '700' },
});