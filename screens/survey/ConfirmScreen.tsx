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

// ---- (UI용) 축약 라벨 맵: 서버 전송에는 사용 안 함 ----
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

// ---- (서버 전송용) 코드 매핑 ----
const strip = (s: string) => s?.replace(/[^\p{L}\p{N}\s]/gu, '').trim(); // 이모지 제거
const toNumber = (v: any) => Number(String(v ?? '').replace(/[^\d]/g, '')) || 0;

// 성별: 1 남자 / 2 여자 / 3 밝힘거부
const mapGenderToCode = (g?: string | null) => {
  if (!g) return 3;
  const s = strip(g);
  if (s?.includes('남')) return 1;
  if (s?.includes('여')) return 2;
  return 3;
};

// 최종학력: 1 중졸이하 / 2 고졸 / 3 2~3년제 / 4 4년제 / 5 대학원 이상
const mapEduToCode = (e?: string | null) => {
  const s = strip(e ?? '');
  if (!s) return undefined;
  if (s.includes('중') && s.includes('졸')) return 1;
  if (s.includes('고') && s.includes('졸')) return 2;
  if (s.includes('23') || s.includes('2') && s.includes('3') || s.includes('전제')) return 3; // 느슨 매칭
  if (s.includes('4') && s.includes('년제')) return 4;
  if (s.includes('대학원') || s.includes('이상')) return 5;
  return undefined;
};

// 저축: 1~4
const mapSavingToCode = (v?: string | null) => {
  switch (v) {
    case '🚫 저축할 여유가 없다': return 1;
    case '💰 조금씩이라도 저축 중이다': return 2;
    case '📅 매달 일정 금액 이상 저축 중이다': return 3;
    case '📈 저축 외에도 투자까지 여유가 있다': return 4;
    default: return undefined;
  }
};

// 생활비: 1~4
const mapSpendingToCode = (v?: string | null) => {
  switch (v) {
    case '🚫 생활비도 빠듯해 기본적인 지출이 어렵다': return 1;
    case '🧾 기본 생활비는 가능한 수준이다': return 2;
    case '👜 여유 있게 쓰고 약간의 소비도 가능하다': return 3;
    case '🎯 원하는 취미나 자기계발에도 충분히 투자할 수 있다': return 4;
    default: return undefined;
  }
};

// 대인관계 빈도: 없음=1, 보통=3, 활발=5
const mapRelationFreq = (v?: string | null) => {
  if (!v) return undefined;
  if (v.includes('없')) return 1;
  if (v.includes('활발')) return 5;
  return 3; // 보통
};

// 관계 스타일: 깊고 좁게=2, 넓고 얕게=4
const mapRelationStyle = (v?: string | null) => {
  if (!v) return undefined;
  if (v.includes('깊') || v.includes('좁')) return 2;
  if (v.includes('넓') || v.includes('얕')) return 4;
  return undefined;
};

// 감정기복: 1~4
const mapMoodToCode = (v?: string | null) => {
  switch (v) {
    case '😊 감정이 안정적이고 쉽게 흔들리지 않아요': return 1;
    case '🙂 약간의 기복은 있지만 스스로 잘 조절해요': return 2;
    case '😕 기분 변화가 가끔 심한 편이에요': return 3;
    case '😣 감정 기복이 크고, 컨트롤이 잘 안 될 때도 있어요': return 4;
    default: return undefined;
  }
};

// 스트레스해소: 1~4
const mapStressToCode = (v?: string | null) => {
  switch (v) {
    case '✨ 운동이나 산책 같은 신체 활동을 해요': return 1;
    case '💡 음악을 듣거나 영화를 보며 혼자만의 시간을 보내요': return 2;
    case '🗣️ 가족이나 친구와 대화하면서 스트레스를 풀어요': return 3;
    case '😶 뚜렷한 해소 방법이 없어서 그냥 버티는 편이에요': return 4;
    default: return undefined;
  }
};

// 우선순위 라벨 → 순위 숫자 (1=가장 중요)
const priorityMapFromOrder = (order: string[] | undefined) => {
  // 저장 형식은 이모지 제거/공백 제거된 키 사용을 가정: '나이','성별','경제상황및대인관계','성격','흥미','관심분야'
  const result: Record<'나이'|'성별'|'경제상황및대인관계'|'성격'|'흥미'|'관심분야', number | undefined> = {
    나이: undefined,
    성별: undefined,
    경제상황및대인관계: undefined,
    성격: undefined,
    흥미: undefined,
    관심분야: undefined,
  };
  (order ?? []).forEach((k, i) => {
    const key = strip(k)?.replace(/\s+/g, '') as keyof typeof result;
    if (key && key in result) result[key] = i + 1;
  });
  return result;
};

export default function ConfirmScreen() {
  const insets = useSafeAreaInsets();

  // presurvey 데이터(나이/성별/경력/저축/생활비/대인관계/감정/스트레스)
  const { data: pre } = usePreSurvey();
  // survey 데이터(1~44 Likert, 45 관심분야 문자열, 46 최소연봉 숫자, 47 우선순위)
  const { data: survey } = useSurveyMain();

  // ---- payload(백엔드 전송용: 요구 스키마로 직렬화) ----
  const payload = useMemo(() => {
    // 1) 우선순위 맵
    const pmap = priorityMapFromOrder(survey.priorityOrder);

    // 2) 관심분야 배열(최대 3개)
    const 관심분야Arr = String(survey.interestField ?? '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 3);

    // 3) 최소급여 숫자
    const 최소급여 =
      typeof survey.desiredSalaryYear === 'number'
        ? Math.max(0, survey.desiredSalaryYear)
        : Math.max(0, toNumber(survey.desiredSalaryYear));

    // 4) Likert(1~44) → 성격(1~20) / 흥미(21~44) 그룹화
    const likert = survey.likert ?? [];
    const get = (idx1: number) => (likert[idx1 - 1] ?? 3) as 1 | 2 | 3 | 4 | 5;

    const 성격 = {
      priority: pmap['성격'],
      외향성: [get(1), get(2), get(3), get(4)],
      친화성: [get(5), get(6), get(7), get(8)],
      성실성: [get(9), get(10), get(11), get(12)],
      신경성: [get(13), get(14), get(15), get(16)],
      개방성: [get(17), get(18), get(19), get(20)],
    };

    const 흥미 = {
      priority: pmap['흥미'],
      실재형: [get(21), get(22), get(23), get(24)],
      탐구형: [get(25), get(26), get(27), get(28)],
      예술형: [get(29), get(30), get(31), get(32)],
      사회형: [get(33), get(34), get(35), get(36)],
      기업형: [get(37), get(38), get(39), get(40)],
      관습형: [get(41), get(42), get(43), get(44)],
    };

    // 5) 경력: 첫 항목을 대표로 전송(복수 입력 시 정책 확정되면 변경)
    let 경력Payload:
      | { value: true; 분야: string; 기간: string }
      | { value: false } = { value: false };
    if (pre.hasExperience && pre.experiences?.length) {
      const e = pre.experiences[0];
      const y = toNumber(e?.years);
      const m = toNumber(e?.months);
      const totalMonths = y * 12 + m;
      경력Payload = {
        value: true,
        분야: e?.field ?? '',
        기간: String(totalMonths), // 개월 단위
      };
    }

    // 6) 전송 페이로드(요구 스키마)
    return {
      나이: { priority: pmap['나이'], value: toNumber(pre.age) || undefined },
      성별: { priority: pmap['성별'], value: mapGenderToCode(pre.gender) },
      최종학력: { value: mapEduToCode(pre.education) },

      경력: 경력Payload,

      '경제상황 및 대인관계': {
        priority: pmap['경제상황및대인관계'],
        저축: mapSavingToCode(pre.savingFull),
        생활비: mapSpendingToCode(pre.spendingFull),
        대인관계: mapRelationFreq(pre.relationFreq),
        '관계 스타일': mapRelationStyle(pre.relationStyle),
      },

      감정기복: { value: mapMoodToCode(pre.moodFull) },
      스트레스해소: { value: mapStressToCode(pre.stressFull) },

      성격,
      흥미,

      관심분야: { priority: pmap['관심분야'], value: 관심분야Arr },

      최소급여: 최소급여,
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
        const txt = await res.text().catch(() => '');
        throw new Error(`${res.status} ${txt}`);
      }
      Alert.alert('제출 완료', '감사합니다!');
      router.replace('/(tabs)/home');
    } catch (e: any) {
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
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 3);

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
                  .slice(0, 2)
                  .map(e => {
                    const y = toNumber(e.years);
                    const m = toNumber(e.months);
                    if (y > 0 && m > 0) return `${e.field} · ${y}년차 ${m}개월`;
                    if (y > 0 && m === 0) return `${e.field} · ${y}년차`;
                    if (y === 0 && m > 0) return `${e.field} · ${m}개월`;
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
