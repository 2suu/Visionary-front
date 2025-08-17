// screens/survey/ConfirmScreen.tsx
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 1) 설문(1~47) 컨텍스트
import { useSurvey as useSurveyMain } from './survey-context';
// 2) 프리서베이(나이/성별/경력/저축/생활비/대인관계/감정/스트레스) 컨텍스트
import { useSurvey as usePreSurvey } from '../presurvey/survey-context';

const PRIMARY = '#4E41FF';

// ---- 확인 화면에서만 쓰는 축약 라벨 맵(서버 전송에는 사용 안 함) ----
const SAVING_SHORT: Record<string, string> = {
  '🚫 저축할 여유가 없다': '🚫 여유없음',
  '💰 조금씩이라도 저축 중이다': '💰 조금씩 저축',
  '📅 매달 일정 금액 이상 저축 중이다': '📅 매달 저축 중',
  '📈 저축 외에도 투자까지 여유가 있다': '📈 투자까지',
};
const SPENDING_SHORT: Record<string, string> = {
  '🚫 생활비도 빠듯해 기본적인 지출이 어렵다': '🚫 빠듯함',
  '🧾 기본 생활비는 가능한 수준이다': '🧾 기본생활비 감당',
  '👜 여유 있게 쓰고 약간의 소비도 가능하다': '👜 약간소비가능',
  '🎯 원하는 취미나 자기계발에도 충분히 투자할 수 있다': '🎯 원하는것에 투자가능',
};
const MOOD_SHORT: Record<string, string> = {
  '😊 감정이 안정적이고 쉽게 흔들리지 않아요': '😊 안정적',
  '🙂 약간의 기복은 있지만 스스로 잘 조절해요': '🙂 스스로 조절',
  '😕 기분 변화가 가끔 심한 편이에요': '😕 가끔심함',
  '😣 감정 기복이 크고, 컨트롤이 잘 안 될 때도 있어요': '😣 컨트롤 안됨',
};
const STRESS_SHORT: Record<string, string> = {
  '✨ 운동이나 산책 같은 신체 활동을 해요': '✨ 신체활동',
  '💡 음악을 듣거나 영화를 보며 혼자만의 시간을 보내요': '💡 혼자만의 시간',
  '🗣️ 가족이나 친구와 대화하면서 스트레스를 풀어요': '🗣️ 대화',
  '😶 뚜렷한 해소 방법이 없어서 그냥 버티는 편이에요': '😶 버티기',
};

export default function ConfirmScreen() {
  const insets = useSafeAreaInsets();

  // presurvey 데이터(나이/성별/경력/저축/생활비/대인관계/감정/스트레스)
  const { data: pre } = usePreSurvey();
  // survey 데이터(1~44 Likert, 45 관심분야 문자열, 46 최소연봉 숫자, 47 우선순위)
  const { data: survey } = useSurveyMain();

  // ---- payload(백엔드 전송용: 원본 문장/숫자/배열) ----
  const payload = useMemo(() => {
    // likert 배열을 객체로 변환
    const likert = survey.likert ?? [];
    const 성격_1_20: Record<number, 1|2|3|4|5> = {};
    const 흥미_21_44: Record<number, 1|2|3|4|5> = {};
    for (let i=1;i<=20;i++) 성격_1_20[i] = (likert[i-1] ?? 3) as 1|2|3|4|5;
    for (let i=21;i<=44;i++) 흥미_21_44[i] = (likert[i-1] ?? 3) as 1|2|3|4|5;

    // 관심분야: 콤마 분리 배열(최대 3개)
    const 관심분야 = String(survey.interestField ?? '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0,3);

    // 최소급여: 숫자 보장
    const 최소급여 =
      typeof survey.desiredSalaryYear === 'number'
        ? Math.max(0, survey.desiredSalaryYear)
        : Math.max(0, Number(String(survey.desiredSalaryYear ?? '0').replace(/[^\d]/g, '')));

    return {
      인구통계: {
        나이: pre.age ?? null,
        성별: pre.gender ?? null,
        최종학력: pre.education ?? null,
      },
      경력: {
        경력있음: !!pre.hasExperience,
        목록: (pre.hasExperience ? pre.experiences : []).slice(0,2).map(e => ({
          분야: e.field ?? '',
          년수: e.years ?? 0,
          개월: e.months ?? 0,
        })),
      },
      재정: {
        저축상태: pre.savingFull ?? null,     // ← 원본 문장 그대로
        생활비만족: pre.spendingFull ?? null, // ← 원본 문장 그대로
      },
      대인관계: {
        교류빈도: pre.relationFreq ?? null,
        관계스타일: pre.relationStyle ?? null,
      },
      감정: { 기복: pre.moodFull ?? null },      // ← 원본 문장
      스트레스: { 해소방법: pre.stressFull ?? null }, // ← 원본 문장

      심리척도: {
        '성격_1~20': 성격_1_20,
        '흥미_21~44': 흥미_21_44,
      },

      선호: {
        관심분야,
        최소급여,
        우선순위: survey.priorityOrder ?? [],
      },
    };
  }, [pre, survey]);

  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    try {
      setSubmitting(true);
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE}/api/survey/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text().catch(()=>'');
        throw new Error(`${res.status} ${txt}`);
      }
      Alert.alert('제출 완료', '감사합니다!');
      router.replace('/(tabs)/home');
    } catch (e:any) {
      Alert.alert('제출 실패', e?.message ?? '네트워크 오류');
    } finally {
      setSubmitting(false);
    }
  };

  // ---- 확인 화면(UI): 축약 라벨로만 표시 (서버 전송엔 영향 없음) ----
  const uiSaving = SAVING_SHORT[pre.savingFull ?? ''] ?? (pre.savingFull ?? '-');
  const uiSpending = SPENDING_SHORT[pre.spendingFull ?? ''] ?? (pre.spendingFull ?? '-');
  const uiMood = MOOD_SHORT[pre.moodFull ?? ''] ?? (pre.moodFull ?? '-');
  const uiStress = STRESS_SHORT[pre.stressFull ?? ''] ?? (pre.stressFull ?? '-');

  const uiInterests = (survey.interestField ?? '')
    .split(',').map(s=>s.trim()).filter(Boolean).slice(0,3);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>답변 확인</Text>

        <Row label="나이" value={pre.age ? `${pre.age}세` : '-'} />
        <Row label="성별" value={pre.gender ?? '-'} />
        <Row label="최종학력" value={pre.education ?? '-'} />

        {/* 경력 여러 개일 수 있어 줄바꿈 */}
        <Row
          label="경력"
          value={
            (pre.hasExperience && pre.experiences?.length)
              ? pre.experiences
                  .slice(0,2)
                  .map(e => {
                    const y = e.years ?? 0, m = e.months ?? 0;
                    if (y>0 && m>0) return `${e.field} · ${y}년차 ${m}개월`;
                    if (y>0 && m===0) return `${e.field} · ${y}년차`;
                    if (y===0 && m>0) return `${e.field} · ${m}개월`;
                    return `${e.field}`;
                  })
                  .join('\n')
              : '없음'
          }
          multiline
        />

        <Row label="저축" value={uiSaving} />
        <Row label="생활비" value={uiSpending} />
        <Row label="대인관계" value={`${pre.relationFreq ?? '-'}, ${pre.relationStyle ?? '-'}`} />
        <Row label="감정기복" value={uiMood} />
        <Row label="스트레스 해소" value={uiStress} />

        <Row label="관심분야" value={uiInterests.length ? uiInterests.join(', ') : '-'} />
        <Row
          label="최소급여"
          value={
            typeof survey.desiredSalaryYear === 'number'
              ? `${survey.desiredSalaryYear.toLocaleString('ko-KR')} 원`
              : '-'
          }
        />
        <Row
          label="우선순위"
          value={(survey.priorityOrder ?? []).join(', ')}
          multiline
        />

        <TouchableOpacity
          style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
          onPress={submit}
          disabled={submitting}
        >
          <Text style={styles.submitText}>{submitting ? '전송 중...' : '제출하기'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Row({ label, value, multiline }: { label: string; value?: string; multiline?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text
        style={[styles.value, multiline && { textAlign: 'right' }]}
        numberOfLines={multiline ? 6 : 1}
      >
        {value || '-'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 20, fontWeight: '700', color: PRIMARY, marginBottom: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  label: { fontWeight: '600', color: '#333', paddingRight: 12 },
  value: { color: '#555', maxWidth: '65%', textAlign: 'right', lineHeight: 18 },
  submitBtn: {
    marginTop: 24,
    padding: 14,
    backgroundColor: PRIMARY,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
