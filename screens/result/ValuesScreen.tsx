// screens/result/SummaryScreen.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PRIMARY = '#4E41FF';
const BOX_BG = '#F6F7FF';
const GRAY = '#6A6A76';

export default function SummaryScreen() {
  // TODO: 실제 데이터 바인딩 (컨텍스트/서버 값으로 교체)
  const hiring = [
    '문제 정의→해결안 도출 흐름이 명확함',
    '대인 협업 의지가 높고 피드백 순응성 양호',
    '목표 설정 후 체계적으로 실행·점검하는 편',
  ];
  const trait = [
    '성실성/외향성 상위 → 협업·리더십 적합',
    '안정적 환경에서 지속 수행 능력 우수',
    '타인을 존중하고 과제를 체계적으로 처리',
  ];
  const interest = [
    '사회형·예술형 상위 → 표현/대인 상호작용 강점',
    '탐구형 보유 → 분석적 접근도 가능',
    '교육/콘텐츠/디자인 융합 직무에 적합',
  ];
  const values = [
    '기여·영향을 중시, 의미 있는 성과를 선호',
    '성장/학습 기회 중요, 공정한 보상 선호',
  ];

  const improve = [
    { title: '기업형 영역 확장', desc: '목표/성과 지표를 스스로 설정하고 주기적으로 리뷰' },
    { title: '복잡한 업무 관리', desc: '큰 문제를 쪼개어 우선순위/의존성을 정리하는 훈련' },
    { title: '버논스 훈련', desc: '가설→실험→회고 사이클을 짧게 돌려 실행력 향상' },
  ];

  const traits = [
    '책임감이 높아 마감 준수 확률이 높음',
    '협업에서 갈등 조정보다 조율·합의를 선호',
    '새로운 아이디어 탐색에 두려움이 적음',
    '감정적 스트레스 상황에서도 비교적 안정적',
  ];

  const finalParagraph =
    '직무 적합도는 “표현/대인 상호작용 + 체계적 실행”이 핵심입니다. 교육·콘텐츠 기획/운영, UX리서치, 에듀테크 PM/PO 등에서 강점을 보일 가능성이 높습니다. KPI 기반의 목표관리 루틴을 도입하면 성과와 만족도가 함께 상승할 것입니다.';

  return (
    <View style={styles.card}>
      <Text style={styles.title}>종합 분석</Text>

      {/* 채용 인사이트 */}
      <Section title="채용 인사이트">
        <HighlightBox icon="🏆" title="상위 포인트(강점)" items={hiring} />
        <HighlightBox icon="🌟" title="성향 요약(핵심)" items={trait} />
        <HighlightBox icon="🎯" title="흥미/가치관 포인트" items={[...interest.slice(0,2), values[0]]} />
      </Section>

      {/* 핵심 가치관 (트로피) */}
      <Section title="핵심 가치관">
        <View style={styles.trophyRow}>
          <Trophy color="#EAB308" label="성장/학습" />
          <Trophy color="#A855F7" label="사회적 기여" />
          <Trophy color="#94A3B8" label="공정한 보상" />
        </View>
      </Section>

      {/* 개선 필요 영역 */}
      <Section title="개선 필요 영역">
        {improve.map((b) => (
          <TipCard key={b.title} title={b.title} desc={b.desc} />
        ))}
      </Section>

      {/* 특징 */}
      <Section title="특징">
        {traits.map((t) => (
          <Bullet key={t} text={t} />
        ))}
      </Section>

      {/* 종합 분석 결과 */}
      <Section title="종합 분석 결과">
        <Text style={styles.paragraph}>{finalParagraph}</Text>
      </Section>
    </View>
  );
}

/* ── 작은 컴포넌트 ────────────────────────────── */

function Section({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={styles.h2}>{title}</Text>
      <View style={{ gap: 10 }}>{children}</View>
    </View>
  );
}

function HighlightBox({
  icon,
  title,
  items,
}: {
  icon: string;
  title: string;
  items: string[];
}) {
  return (
    <View style={styles.hiBox}>
      <Text style={styles.hiTitle}>
        <Text style={{ fontSize: 18 }}>{icon} </Text>
        {title}
      </Text>
      <View style={{ marginTop: 8 }}>
        {items.map((t) => (
          <Bullet key={t} text={t} />
        ))}
      </View>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

function Trophy({ color, label }: { color: string; label: string }) {
  return (
    <View style={[styles.trophy, { borderColor: color }]}>
      <Text style={{ fontSize: 28 }}>🏆</Text>
      <Text style={[styles.trophyText, { color }]}>{label}</Text>
    </View>
  );
}

function TipCard({ title, desc }: { title: string; desc: string }) {
  return (
    <View style={styles.tipCard}>
      <Text style={styles.tipTitle}>{title}</Text>
      <Text style={styles.tipDesc}>{desc}</Text>
    </View>
  );
}

/* ── styles ───────────────────────────────────── */

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 6 },

  h2: { fontSize: 15, fontWeight: '800', marginBottom: 6 },
  paragraph: { color: GRAY, lineHeight: 20 },

  hiBox: {
    backgroundColor: BOX_BG,
    borderWidth: 1,
    borderColor: '#D9DBFF',
    borderRadius: 12,
    padding: 12,
  },
  hiTitle: { fontWeight: '800' },

  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 4 },
  bulletDot: { width: 16, textAlign: 'center', color: PRIMARY, marginTop: 1 },
  bulletText: { flex: 1, color: '#111' },

  trophyRow: { flexDirection: 'row', gap: 10 },
  trophy: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1.2,
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  trophyText: { marginTop: 6, fontWeight: '800' },

  tipCard: {
    backgroundColor: '#EFEAFF',
    borderRadius: 12,
    padding: 12,
  },
  tipTitle: { fontWeight: '800', marginBottom: 4 },
  tipDesc: { color: GRAY },
});
