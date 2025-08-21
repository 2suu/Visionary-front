// screens/survey/ConfirmScreen.tsx
// 설문 답변 최종 확인 & 제출(백엔드 POST)
// - 탭: 성격(1~20), 흥미(21~44), 관심분야(45), 연봉(46), 우선순위(47)
// - Presurvey + Survey 데이터를 번호(code) 기반으로 병합하여 전송
// - 전송 과정 전체를 console로 자세히 출력(디버깅 편의)

import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LIKERT_QUESTIONS } from './questions';
import { useSurvey } from './survey-context';

// ⬇️ presurvey 컨텍스트(코드/라벨 저장되어 있음)
import {
  EDUCATION_CODE,
  GENDER_CODE,
  MOOD_CODE,
  REL_FREQ_CODE,
  REL_STYLE_CODE,
  SAVING_CODE,
  SPENDING_CODE,
  STRESS_CODE,
  useSurvey as usePreSurvey,
} from '../presurvey/survey-context';

const PRIMARY = '#4E41FF';
const HOME_ROUTE = '/(tabs)/home'; // 프로젝트 구조에 맞게 조정

// Likert 값 라벨 매핑 (UI 표시용)
const LIKERT_LABELS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: '1. 전혀 아니다',
  2: '2. 그렇지 않은 편이다',
  3: '3. 보통',
  4: '4. 그런 편이다',
  5: '5. 매우 그렇다',
};

// 상단 탭 정의
const TABS = [
  { key: 'trait', label: '성격', range: [1, 20] as const },
  { key: 'interest', label: '흥미', range: [21, 44] as const },
  { key: 'field', label: '관심분야', range: [45, 45] as const },
  { key: 'salary', label: '연봉', range: [46, 46] as const },
  { key: 'priority', label: '우선순위', range: [47, 47] as const },
] as const;

type TabKey = (typeof TABS)[number]['key'];

// =========================
// 우선순위 정규화 & 맵핑
// =========================
const PRIORITY_KEYS = ['나이', '성별', '경제상황및대인관계', '성격', '흥미', '관심분야'] as const;
type PKey = (typeof PRIORITY_KEYS)[number];

// 라벨 → 정식 키 정규화
const normalizePriority = (s?: string): PKey | null => {
  if (!s) return null;
  const t = s
    .replace(/[\s\u200B-\u200D\uFEFF]/g, '') // 공백/제로폭 제거
    .replace(/[^\w가-힣]/g, ''); // 이모지/특수문자 제거
  if (t === '나이') return '나이';
  if (t === '성별') return '성별';
  if (t === '성격') return '성격';
  if (t === '흥미') return '흥미';
  if (t === '관심분야') return '관심분야';
  if (t === '경제상황및대인관계') return '경제상황및대인관계'; // '경제상황 및 대인관계'의 공백·기호 제거형
  return null;
};

// 우선순위 배열 → {키: 순위번호} 맵
const priorityMapFromOrder = (order?: string[]) => {
  if (!Array.isArray(order)) return {};
  const m: Partial<Record<PKey, number>> = {};
  order.forEach((label, idx) => {
    const k = normalizePriority(label);
    if (k) m[k] = idx + 1; // 1~6
  });
  return m;
};

// =========================
// 유틸 (payload 구성에 사용)
// =========================

// 빈 값 제거
const compactDeep = (obj: any) => {
  const isEmpty = (v: any) =>
    v == null ||
    (Array.isArray(v) && v.length === 0) ||
    (typeof v === 'object' && v != null && Object.keys(v).length === 0);

  const recur = (o: any): any => {
    if (Array.isArray(o)) return o.map(recur).filter(v => !isEmpty(v));
    if (o && typeof o === 'object') {
      const out: any = {};
      Object.entries(o).forEach(([k, v]) => {
        const nv = recur(v);
        if (!isEmpty(nv)) out[k] = nv;
      });
      return out;
    }
    return o;
  };
  return recur(obj);
};

// Likert(1~44) → 성격/흥미 그룹 (각 4문항씩 자른 구조)
const slice4 = (arr: number[], start: number) => arr.slice(start, start + 4);
const buildPersonality = (likert: (number | null)[]) => {
  const vals = likert.map(v => (typeof v === 'number' ? v : 0));
  return {
    '외향성': slice4(vals, 0),
    '친화성': slice4(vals, 4),
    '성실성': slice4(vals, 8),
    '신경성': slice4(vals, 12),
    '개방성': slice4(vals, 16),
  };
};
const buildInterest = (likert: (number | null)[]) => {
  const vals = likert.map(v => (typeof v === 'number' ? v : 0));
  const base = 20; // 21~44는 0-index로 20부터
  return {
    '실재형': slice4(vals, base + 0),
    '탐구형': slice4(vals, base + 4),
    '예술형': slice4(vals, base + 8),
    '사회형': slice4(vals, base + 12),
    '기업형': slice4(vals, base + 16),
    '관습형': slice4(vals, base + 20),
  };
};

// =========================
// 컴포넌트
// =========================
export default function ConfirmScreen() {
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  const paramTab = (tabParam as TabKey) || 'trait';
  const validParamTab: TabKey =
    (['trait', 'interest', 'field', 'salary', 'priority'] as TabKey[]).includes(paramTab)
      ? paramTab
      : 'trait';

  // survey(메인)
  const { data } = useSurvey();
  const likert = data.likert ?? [];
  const q45Text = data.interestField;
  const q46Salary = data.desiredSalaryYear;
  const q47Order = data.priorityOrder;

  // presurvey
  const pre = usePreSurvey();

  const [tab, setTab] = useState<TabKey>(validParamTab);

  // 쿼리 파라미터(tab) 변경 시 상태 동기화
  useEffect(() => {
    if (tabParam && ['trait', 'interest', 'field', 'salary', 'priority'].includes(tabParam)) {
      setTab(tabParam as TabKey);
    }
  }, [tabParam]);

  const numbers = useMemo(() => {
    const found = TABS.find((t) => t.key === tab)!;
    const [start, end] = found.range;
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [tab]);

  // -------------------------
  // 제출용 payload 생성
  // -------------------------
  const buildPayload = () => {
    const pmap = priorityMapFromOrder(q47Order);

    // ── presurvey(code 우선 + 라벨 fallback) ──
    const age =
      typeof pre.data.age === 'number' && Number.isFinite(pre.data.age)
        ? pre.data.age
        : undefined;

    const genderCode =
      pre.data.genderCode ??
      (pre.data.gender ? GENDER_CODE[pre.data.gender] : undefined);

    const educationCode =
      pre.data.educationCode ??
      (pre.data.education ? EDUCATION_CODE[pre.data.education] : undefined);

    const savingCode =
      pre.data.savingCode ??
      (pre.data.savingFull ? SAVING_CODE[pre.data.savingFull] : undefined);

    const spendingCode =
      pre.data.spendingCode ??
      (pre.data.spendingFull ? SPENDING_CODE[pre.data.spendingFull] : undefined);

    const relFreqCode =
      pre.data.relationFreqCode ??
      (pre.data.relationFreq ? REL_FREQ_CODE[pre.data.relationFreq] : undefined);

    const relStyleCode =
      pre.data.relationStyleCode ??
      (pre.data.relationStyle ? REL_STYLE_CODE[pre.data.relationStyle] : undefined);

    const moodCode =
      pre.data.moodCode ??
      (pre.data.moodFull ? MOOD_CODE[pre.data.moodFull] : undefined);

    const stressCode =
      pre.data.stressCode ??
      (pre.data.stressFull ? STRESS_CODE[pre.data.stressFull] : undefined);

    // 디버깅: presurvey 원본 + 유도 코드들
    console.log('[CONFIRM] presurvey raw:', pre.data);
    console.log('[CONFIRM] derived codes:', {
      age,
      genderCode,
      educationCode,
      savingCode,
      spendingCode,
      relFreqCode,
      relStyleCode,
      moodCode,
      stressCode,
    });

    const presurveyPart = {
  '나이': age != null ? { priority: pmap['나이'], value: age } : { priority: pmap['나이'] },
  '성별': genderCode != null ? { priority: pmap['성별'], value: genderCode } : { priority: pmap['성별'] },
  '최종학력': educationCode != null ? { value: educationCode } : {},
  '경력': pre.data.hasExperience
    ? (() => {
        const first = pre.data.experiences?.[0];
        const months = (first?.years ?? 0) * 12 + (first?.months ?? 0);
        return {
          value: true,
          '분야': first?.field || undefined,
          '기간': months ? String(months) : undefined,
        };
      })()
    : { value: false },

  // 경제/대인관계: undefined 필드를 없애려면 compactDeep를 감싸는 게 안전
  '경제상황 및 대인관계': compactDeep({
    priority: pmap['경제상황및대인관계'],
    '저축':         savingCode,
    '생활비':       spendingCode,
    '인간관계':     relFreqCode,    // ← 키 이름 변경(대인관계 → 인간관계)
    '관계 스타일':  relStyleCode,
  }),

  // ⬇️ 조건부로 키 추가(값만 숫자). 객체 리터럴 안에서 반드시 ...로 펼치기!
  ...(typeof moodCode === 'number'   ? { '감정기복':   moodCode }   : {}),
  ...(typeof stressCode === 'number' ? { '스트레스해소': stressCode } : {}),
};


    // ── survey ──
    const personality = buildPersonality(likert);
    const interest = buildInterest(likert);
    const fieldArr = (q45Text ?? '')
      .split(/[,\s]+/g)
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 6);

    const surveyPart = {
      '성격': { priority: pmap['성격'], ...personality },
      '흥미': { priority: pmap['흥미'], ...interest },
      '관심분야': fieldArr.length ? { priority: pmap['관심분야'], value: fieldArr } : undefined,
      '최소급여': typeof q46Salary === 'number' ? q46Salary : undefined,
    };

    const merged = compactDeep({ ...presurveyPart, ...surveyPart });

    // 디버깅 로그
    console.log('[CONFIRM] q47Order:', q47Order, 'len=', Array.isArray(q47Order) ? q47Order.length : 0);
    console.log('[CONFIRM] priority map:', pmap);
    console.log('[CONFIRM] merged payload:', merged);

    return merged;
  };

  // -------------------------
  // 제출 핸들러
  // -------------------------
  const handleSubmit = async () => {
    try {
      const payload = buildPayload();

      const baseRaw = (process.env.EXPO_PUBLIC_API_BASE ?? 'http://localhost:8080').replace(/\/+$/, '');
      const base =
        Platform.OS === 'android' && baseRaw.includes('localhost')
          ? baseRaw.replace('localhost', '10.0.2.2')
          : baseRaw;

      const url = `${base}/api/survey/submit`;

      console.log('[CONFIRM] POST', url);
      console.log('[CONFIRM] headers', { 'Content-Type': 'application/json;charset=utf-8' });
      console.log('[CONFIRM] body JSON:', JSON.stringify(payload, null, 2));

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(payload),
      });

      console.log('[CONFIRM] status:', res.status, res.statusText);

      // 응답 본문 로깅(가능한 경우)
      const text = await res.text();
      let parsed: any = text;
      try { parsed = JSON.parse(text); } catch { /* text 그대로 둠 */ }
      console.log('[CONFIRM] response body:', parsed);

      if (!res.ok) {
        alert(`제출 실패\ncode: ${res.status}`);
        return;
      }

      alert('제출이 완료되었어요!');
      router.replace(HOME_ROUTE);
    } catch (e: any) {
      console.log('[CONFIRM] submit error:', e);
      alert('네트워크 오류가 발생했어요.');
    }
  };

  // -------------------------
  // 렌더링
  // -------------------------
  const goEdit = (no: number) => {
    const retTab: TabKey =
      no >= 1 && no <= 20 ? 'trait'
        : no >= 21 && no <= 44 ? 'interest'
          : no === 45 ? 'field'
            : no === 46 ? 'salary'
              : 'priority';

    if (no >= 1 && no <= 44) {
      router.push({ pathname: '/survey/q/[no]', params: { no: String(no), mode: 'edit', retTab } });
      return;
    }
    if (no === 45) { router.push({ pathname: '/survey/q/45', params: { mode: 'edit', retTab } }); return; }
    if (no === 46) { router.push({ pathname: '/survey/q/46', params: { mode: 'edit', retTab } }); return; }
    if (no === 47) { router.push({ pathname: '/survey/q/47', params: { mode: 'edit', retTab } }); }
  };

  const renderLikert = (no: number) => {
    const q = LIKERT_QUESTIONS[no - 1] ?? `Q${no}.`;
    const v = likert[no - 1];
    const label = v ? LIKERT_LABELS[v as 1 | 2 | 3 | 4 | 5] : '응답 없음';
    return (
      <AnswerCard key={no} title={`Q${no}. ${q}`} right={label} onEdit={() => goEdit(no)} />
    );
  };

  const renderQ45 = () => (
    <AnswerCard
      key={45}
      title={`Q45. 진로 선택에 있어 흥미를 느끼는 분야는 무엇인가요?`}
      right={q45Text && q45Text.trim().length > 0 ? q45Text : '응답 없음'}
      onEdit={() => goEdit(45)}
    />
  );

  const renderQ46 = () => (
    <AnswerCard
      key={46}
      title={`Q46. 최소 희망연봉을 입력해주세요.`}
      right={
        typeof q46Salary === 'number'
          ? q46Salary.toLocaleString('ko-KR')
          : '응답 없음'
      }
      onEdit={() => goEdit(46)}
    />
  );

  const renderQ47 = () => {
    const arr = Array.isArray(q47Order) ? q47Order : [];
    if (!arr.length) {
      return (
        <AnswerCard
          key={47}
          title={`Q47. 진로 선택 시 자신에게 중요한 요소를 우선순위에 따라 번호를 매겨주세요.`}
          right={'응답 없음'}
          multiline
          onEdit={() => goEdit(47)}
        />
      );
    }
    const text = arr.map((v, i) => `${i + 1}. ${v}`).join('\n');
    return (
      <View key={47} style={styles.card}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          Q47. 진로 선택 시 자신에게 중요한 요소를 우선순위에 따라 번호를 매겨주세요.
        </Text>
        <View style={styles.answerRow}>
          <ScrollView
            style={styles.answerScroll}
            contentContainerStyle={{ paddingRight: 2 }}
            nestedScrollEnabled
            showsVerticalScrollIndicator
          >
            <Text style={[styles.answerText, { lineHeight: 20 }]}>{text}</Text>
          </ScrollView>
          <TouchableOpacity onPress={() => goEdit(47)} hitSlop={8}>
            <Text style={styles.pencil}>✏️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const Header = (
    <View style={styles.headerArea}>
      <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
        <Text style={styles.back}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>‘나’와 맞는 직무를 찾아볼까?</Text>
      <Text style={styles.subtitle}>아래 정보가 나와 맞는지 확인해주세요.</Text>
      <TopTabs tab={tab} onChange={setTab} />
    </View>
  );

  const Footer = (
    <View style={styles.footer}>
      <Text style={styles.hint}>수정을 원하는 부분이 있다면 ✏️를 눌러주세요.</Text>
      <TouchableOpacity
        style={styles.confirmBtn}
        onPress={handleSubmit}
      >
        <Text style={styles.confirmBtnText}>확인</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {Header}

      {tab === 'trait' || tab === 'interest' ? (
        <FlatList
          contentContainerStyle={styles.listPad}
          data={numbers}
          keyExtractor={(n) => String(n)}
          renderItem={({ item }) => renderLikert(item)}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.listPad}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator
        >
          {tab === 'field' && renderQ45()}
          {tab === 'salary' && renderQ46()}
          {tab === 'priority' && renderQ47()}
        </ScrollView>
      )}

      {Footer}
    </SafeAreaView>
  );
}

function TopTabs({ tab, onChange }: { tab: TabKey; onChange: (k: TabKey) => void }) {
  const onPress = (k: TabKey) => {
    onChange(k);
    // URL 쿼리 동기화 (뒤로가기/새 진입 시에도 유지)
    router.replace({ pathname: '/survey/confirm', params: { tab: k } });
  };
  return (
    <View style={styles.tabs}>
      {TABS.map((t) => (
        <TouchableOpacity key={t.key} style={styles.tabBtn} onPress={() => onPress(t.key)}>
          <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          {tab === t.key && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function AnswerCard({
  title,
  right,
  onEdit,
  multiline,
}: {
  title: string;
  right: string;
  onEdit: () => void;
  multiline?: boolean;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {title}
      </Text>

      <View style={styles.answerRow}>
        <Text
          style={[styles.answerText, multiline && { lineHeight: 20 }]}
          numberOfLines={multiline ? 6 : 1}
        >
          {right}
        </Text>
        <TouchableOpacity onPress={onEdit} hitSlop={8}>
          <Text style={styles.pencil}>✏️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F8FA' },
  headerArea: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 8 },
  back: { fontSize: 20, color: '#444', paddingVertical: 6 },
  title: { fontSize: 20, fontWeight: '700', color: '#111', marginTop: 4 },
  subtitle: { fontSize: 13, color: '#666', marginTop: 6 },

  tabs: {
    marginTop: 12,
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 4,
  },
  tabBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  tabText: { fontSize: 13, color: '#666' },
  tabTextActive: { color: PRIMARY, fontWeight: '700' },
  tabUnderline: { marginTop: 6, height: 3, width: 28, borderRadius: 999, backgroundColor: PRIMARY },

  listPad: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 120 },

  card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardTitle: { fontSize: 14, color: '#111', fontWeight: '600' },

  answerRow: {
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  answerText: { fontSize: 13, color: '#222', textAlign: 'right', flex: 1, marginRight: 8 },
  pencil: { fontSize: 16 },

  hint: { fontSize: 12, color: '#777', textAlign: 'center', marginBottom: 10 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E6E6EA',
  },
  confirmBtn: { backgroundColor: PRIMARY, borderRadius: 12, alignItems: 'center', paddingVertical: 14 },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Q47 내부 스크롤 텍스트
  answerScroll: {
    maxHeight: 260,
    flex: 1,
  },
});
