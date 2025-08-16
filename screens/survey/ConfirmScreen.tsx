// ──────────────────────────────────────────────────────────────
// screens/survey/ConfirmScreen.tsx
// 설문 답변 최종 확인 & 수정 화면 (단일 문항 수정 후 확인 화면으로 복귀)
// - 탭: 성격(1~20), 흥미(21~44), 관심분야(45), 연봉(46), 우선순위(47)
// - 1~44는 Likert 응답을 라벨로 표시
// - ✏️ 버튼 탭 시 해당 질문 편집 화면으로 이동 (mode=edit & return=/survey/confirm?tab=<해당문항의섹션탭>)
// - 진행도는 유지, 복귀 시 해당 탭 활성화
// ──────────────────────────────────────────────────────────────

import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LIKERT_QUESTIONS } from './questions';
import { useSurvey } from './survey-context';

const PRIMARY = '#4E41FF';
// 파일 상단 import들 아래 적당한 곳에 추가
const HOME_ROUTE = '/(tabs)/home'; // ← 프로젝트 구조에 맞게 '/(tabs)' 또는 '/' 등으로 변경


// Likert 값 라벨 매핑
const LIKERT_LABELS: Record<1|2|3|4|5, string> = {
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

type TabKey = typeof TABS[number]['key'];

// ✅ 문항 번호 → 탭 매핑
const tabByNo = (no: number): TabKey => {
  if (no >= 1 && no <= 20) return 'trait';
  if (no >= 21 && no <= 44) return 'interest';
  if (no === 45) return 'field';
  if (no === 46) return 'salary';
  return 'priority'; // 47
};

export default function ConfirmScreen() {
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  const paramTab = (tabParam as TabKey) || 'trait';
  const validParamTab: TabKey =
    (['trait', 'interest', 'field', 'salary', 'priority'] as TabKey[]).includes(paramTab)
      ? paramTab
      : 'trait';

  const { data } = useSurvey();
  const likert = data.likert ?? [];
  const q45Text = data.interestField;
  const q46Salary = data.desiredSalaryYear;
  const q47Order = data.priorityOrder;

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

  // ✅ 편집 화면 이동: 돌아올 탭을 '해당 문항의 섹션 탭'으로 고정
const goEdit = (no: number) => {
  const retTab = tabByNo(no);

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
    const label = v ? LIKERT_LABELS[v] : '응답 없음';
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
      onPress={() => router.replace(HOME_ROUTE)}  // ← 여기만 수정
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
    // ✅ URL 쿼리 동기화 (뒤로가기/새 진입 시에도 유지)
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
