// screens/presurvey/ExperienceDetailScreen.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import QuestionWrapper from './components/QuestionWrapper';
import { ROUTES, useSurvey } from './survey-context';

type Row = { field: string; years: string; months: string };
type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

const PRIMARY = '#4E41FF';

export default function ExperienceDetailScreen() {
  const { data, upsertExperience, setData } = useSurvey();
  const { from } = useLocalSearchParams<{ from?: 'confirm' }>();

  const initialRows = useMemo<Row[]>(() => {
    if (!data.experiences || data.experiences.length === 0) {
      return [{ field: '', years: '', months: '' }];
    }
    return data.experiences.slice(0, 2).map(e => ({
      field: e.field ?? '',
      years: e.years != null ? String(e.years) : '',
      months: e.months != null ? String(e.months) : '',
    }));
  }, [data.experiences]);

  const [rows, setRows] = useState<Row[]>(initialRows);
  const [error, setError] = useState<string | null>(null);
  const fieldRef0 = useRef<TextInput>(null);

  useEffect(() => {
    const t = setTimeout(() => fieldRef0.current?.focus(), 200);
    return () => clearTimeout(t);
  }, []);

  const addRow = () => {
    if (rows.length >= 2) return;
    setRows(r => [...r, { field: '', years: '', months: '' }]);
  };

  const update = (idx: number, key: keyof Row, val: string) => {
    setRows(r => r.map((row, i) => (i === idx ? { ...row, [key]: val } : row)));
  };

  const remove = (idx: number) => {
    setRows(r => {
      const next = r.filter((_, i) => i !== idx);
      return next.length === 0 ? [{ field: '', years: '', months: '' }] : next;
    });
  };

  const valid = (r: Row) => {
    const y = Number(r.years);
    const m = Number(r.months);
    const yOk = Number.isFinite(y) && y >= 0 && y <= 50;
    const mOk = Number.isFinite(m) && m >= 0 && m <= 11;
    return r.field.trim().length > 0 && (yOk || mOk);
  };

  const goNext = (next: RoutePath) => {
    if (from === 'confirm') {
      router.replace(ROUTES.confirm);
    } else {
      router.push(next);
    }
  };

  const onNext = () => {
    const picked = rows.filter(valid).slice(0, 2);
    if (picked.length === 0) {
      setError('최소 1개 이상, 경력분야와 근무기간(년차/개월)을 입력해 주세요.');
      fieldRef0.current?.focus();
      return;
    }
    setError(null);

    picked.forEach((r, i) => {
      const years = Math.min(50, Math.max(0, Number(r.years || 0)));
      const months = Math.min(11, Math.max(0, Number(r.months || 0)));
      upsertExperience(i, { field: r.field.trim(), years, months });
    });
    if (picked.length === 1) {
      upsertExperience(1, { field: '', years: 0, months: 0 });
    }

    setData({ hasExperience: true });
    goNext(ROUTES.economySaving);
  };

  return (
    <QuestionWrapper
      question="경력이 있으시다면, 어떤 분야에서 몇 년 차이신가요?"
      onNext={onNext}
      error={error}
      topPadding={140}        // 상단 여백
      gapAfterQuestion={10}  // ⬅️ 질문 아래 간격
    >
      {/* 가이드 박스 */}
      <View style={styles.helperBox}>
        <Text style={styles.helperText}>인턴 또는 정규직으로 근무한 분야만 입력 가능합니다.</Text>
        <Text style={styles.helperText}>경력은 최대 2개까지 작성할 수 있습니다.</Text>
        <Text style={styles.example}>작성예시)</Text>
        <Text style={styles.example}>경력분야: 데이터분석 인턴</Text>
        <Text style={styles.example}>근무기간: 0년차 6개월</Text>
      </View>

      {/* 입력 카드들 */}
      <View style={styles.cardsWrap}>
        {rows.map((row, idx) => (
          <View key={idx} style={styles.card}>
            {/* 경력분야 */}
            <View style={styles.rowHeader}>
              <Text style={styles.label}>경력분야</Text>
              {rows.length > 1 && (
                <TouchableOpacity
                  onPress={() => remove(idx)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={{ color: '#9A9AAF' }}>삭제</Text>
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              ref={idx === 0 ? fieldRef0 : undefined}
              value={row.field}
              onChangeText={(t) => update(idx, 'field', t)}
              placeholder="단답형으로 적어주세요."
              placeholderTextColor="#D4D4D4"
              style={styles.fieldInput}
              returnKeyType="next"
              autoCapitalize="none"
              autoCorrect={false}
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

const styles = StyleSheet.create({
  // 좌우 라인업(QuestionWrapper의 paddingLeft:8과 맞춤)
  helperBox: {
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  helperText: { fontSize: 15, color: '#666', marginBottom: 5 },
  example: { fontSize: 13, color: '#888', marginTop: 4 },

  cardsWrap: {
    width: '100%',
    paddingHorizontal: 8,
    rowGap: 12,                   // RN 0.73+; 미지원 시 아래 card.marginBottom 사용
  },

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
    marginBottom: 12,            // rowGap 미지원 대비
  },

  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  label: { fontSize: 15, color: '#444' },

  fieldInput: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFF',
    marginBottom: 10,
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
  suffix: { fontSize: 15, color: '#555' },

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
