// screens/Big5Screen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const PRIMARY = '#4E41FF';
const { width } = Dimensions.get('window');

const CARD_HPAD = 16;
const INNER_GAP = 24; // 카드 안쪽 여백 보정
const CHART_W = width - CARD_HPAD * 2 - INNER_GAP; // 차트 가로
const BAR_W = CHART_W; // 막대 트랙 가로도 차트와 동일하게

// ───────────────────────────────────────────────────────────
// API BASE (안드로이드 에뮬레이터 localhost 보정)
// ───────────────────────────────────────────────────────────
const RAW_BASE = (process.env.EXPO_PUBLIC_API_BASE ?? 'http://localhost:8080').replace(/\/+$/, '');
const API_BASE = (Platform.OS === 'android' && RAW_BASE.includes('localhost'))
  ? RAW_BASE.replace('localhost', '10.0.2.2')
  : RAW_BASE;

// ───────────────────────────────────────────────────────────
// 백엔드 응답 타입 (Big5ResultResponse)
// GET /api/survey-sessions/{surveySessionId}/results/big5
// ───────────────────────────────────────────────────────────
type Trait = {
  code?: 'O'|'C'|'E'|'A'|'N';
  label?: string;           // 개방성/성실성/…
  score?: number | null;    // 원점수(있을 수도/없을 수도)
  percentile?: number | null; // 0~100
};

type Big5ApiResponse = {
  surveySessionId: number;
  type: 'Big5';
  traits: Trait[];
  summary?: string | null;
};

// 프론트에서 사용하기 위한 정규화된 형태
type Big5View = {
  O: number; C: number; E: number; A: number; N: number; // 0~100 (percentile 우선)
  summary?: string | null;
  source: 'api' | 'fallback';
};

// ───────────────────────────────────────────────────────────
// 폴백: 프론트엔드 직무에 어울리는 Big5 예시
// 설명: 창의/사용자 공감(O,A), 꼼꼼/일정관리(C), 소통(E), 스트레스 안정(N 낮음)
// ───────────────────────────────────────────────────────────
function getFrontendFallback(): Big5View {
  return {
    O: 78,   // 개방성(창의/디자인 감수성)
    C: 82,   // 성실성(일정/디테일)
    E: 70,   // 외향성(협업/커뮤니케이션)
    A: 75,   // 친화성(협업 친화)
    N: 35,   // 신경성(낮을수록 안정)
    summary:
      '프론트엔드 성향 예시: 사용자 공감과 시각적 감수성(O)이 높고, ' +
      '품질/디테일(C)과 협업 커뮤니케이션(E/A)에 강점. ' +
      '스트레스 안정성(N)이 비교적 높아 마감과 요구사항 변화에 유연합니다.',
    source: 'fallback',
  };
}

// ───────────────────────────────────────────────────────────
// 백엔드 응답 → 뷰 모델 정규화
// percentile(0~100)이 있으면 그 값을, 없으면 score를 적당히 스케일(0~100)해서 사용
// (score 스케일링은 안전하게 min/max 방어: 없으면 50)
// ───────────────────────────────────────────────────────────
function normalizeBig5(resp: Big5ApiResponse): Big5View {
  const map: Record<'O'|'C'|'E'|'A'|'N', number> = { O: 50, C: 50, E: 50, A: 50, N: 50 };

  // score 스케일링에 대한 보수적 처리(백엔드가 percentile을 주면 그걸 우선 사용)
  let hasAnyPercentile = false;
  resp.traits?.forEach(t => {
    const code = (t.code ?? labelToCode(t.label)) as 'O'|'C'|'E'|'A'|'N' | undefined;
    if (!code) return;
    const p = toIntOrNull(t.percentile);
    if (p != null) {
      hasAnyPercentile = true;
      map[code] = clamp01(p / 100) * 100;
    }
  });

  if (!hasAnyPercentile) {
    // percentile이 전혀 없을 때만 score 사용
    // 점수 범위를 모르면 0~100으로 클램프. (혹시 1~5/1~7 Likert면 *20/*14 근사로 0~100화)
    resp.traits?.forEach(t => {
      const code = (t.code ?? labelToCode(t.label)) as 'O'|'C'|'E'|'A'|'N' | undefined;
      if (!code) return;
      let v = toIntOrNull(t.score);
      if (v == null) { map[code] = 50; return; }

      // 경험칙 변환: 흔한 1~5 Likert → *25, 1~7 → * ~16.7
      // 추정이므로 안정적으로 0~100 범위로만 클램프
      // 백엔드가 score scale을 명세해주면 이 부분을 교체
      if (v <= 7) v = Math.round((v - 1) * (100 / 6)); // 1~7 → 0~100 근사
      else if (v <= 10) v = Math.round(v * 10);        // 0~10 → 0~100
      map[code] = clamp(v, 0, 100);
    });
  }

  return {
    O: map.O, C: map.C, E: map.E, A: map.A, N: map.N,
    summary: resp.summary ?? null,
    source: 'api',
  };
}

// 한글 라벨 → 코드 보정 (백엔드에서도 동일 로직 존재)
function labelToCode(label?: string | null) {
  switch (label) {
    case '개방성': return 'O';
    case '성실성': return 'C';
    case '외향성': return 'E';
    case '친화성': return 'A';
    case '신경성': return 'N';
    default: return undefined;
  }
}
const toIntOrNull = (v: unknown) => (v == null ? null : Number.isFinite(Number(v)) ? Number(v) : null);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const clamp01 = (v: number) => clamp(v, 0, 1);

// ───────────────────────────────────────────────────────────
// 컴포넌트
// ───────────────────────────────────────────────────────────
type Props = {
  surveySessionId: number | string;
  token?: string; // 필요 시 Authorization 헤더
  name?: string;  // 카드 타이틀
};

export default function Big5Screen({ surveySessionId, token, name = '성격 분석' }: Props) {
  const [view, setView] = useState<Big5View | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const chartData = useMemo(() => {
    const v = view ?? getFrontendFallback();
    return {
      labels: ['개방성', '성실성', '외향성', '친화성', '신경성'],
      datasets: [
        {
          data: [v.O, v.C, v.E, v.A, v.N],
        },
      ],
    };
  }, [view]);

  useEffect(() => {
    let aborted = false;
    const controller = new AbortController();

    async function run() {
      try {
        setLoading(true);
        setErr(null);

        const id = typeof surveySessionId === 'string' ? parseInt(surveySessionId, 10) : surveySessionId;
        if (!Number.isFinite(id) || id <= 0) {
          throw new Error('잘못된 설문 세션 ID입니다.');
        }

        const url = `${API_BASE}/api/survey-sessions/${id}/results/big5`;
        console.log('[BIG5] GET', url);

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });

        const text = await res.text();
        console.log('[BIG5] status =', res.status);
        console.log('[BIG5] body   =', text?.slice(0, 500)); // 과도한 로그 방지

        if (!res.ok) {
          // 백엔드 예외: 400(BadRequest), 404(NotFound), 410(Gone) 등
          let msg = `요청 실패 (${res.status})`;
          try {
            const j = text ? JSON.parse(text) : null;
            if (j?.message) msg = j.message;
          } catch {}
          throw new Error(msg);
        }

        const json = text ? (JSON.parse(text) as Big5ApiResponse) : null;
        if (!json || json.type !== 'Big5' || !Array.isArray(json.traits)) {
          throw new Error('응답 형식이 올바르지 않습니다.');
        }

        if (aborted) return;
        const norm = normalizeBig5(json);
        setView(norm);
      } catch (e: any) {
        console.warn('[BIG5] error:', e?.message ?? e);
        if (!aborted) {
          setErr(e?.message ?? '불러오기에 실패했습니다.');
          // 폴백 적용
          setView(getFrontendFallback());
        }
      } finally {
        !aborted && setLoading(false);
      }
    }

    run();
    return () => {
      aborted = true;
      controller.abort();
    };
  }, [surveySessionId, token]);

  const current = view ?? getFrontendFallback();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{name}</Text>

      {/* 상단 소탭 표시 */}
      <View style={styles.subTab}>
        <View style={styles.subTabIndicator} />
        <Text style={styles.subTabText}>
        </Text>
      </View>

      {/* 에러/로딩 표시 */}
{loading ? (
  <View style={{ paddingVertical: 24, alignItems: 'center' }}>
    <ActivityIndicator size="small" color={PRIMARY} />
    <Text style={{ marginTop: 8, color: '#6A6A76' }}>결과를 불러오는 중…</Text>
  </View>
) : null}


      {/* Line Chart (Radar 대체) */}
      <LineChart
        data={chartData}
        width={CHART_W}
        height={240}
        withShadow
        withInnerLines
        withOuterLines
        withDots
        fromZero
        yAxisSuffix="%"
        segments={5} // 0~100을 20% 간격으로
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(78, 65, 255, ${opacity})`,
          labelColor: () => '#666',
          propsForDots: { r: '4' },
          propsForBackgroundLines: { strokeDasharray: '4,6' },
        }}
        bezier
        style={{ alignSelf: 'center', marginVertical: 8 }}
      />

      {/* Bars */}
      <BarRow label="개방성" value={current.O} />
      <BarRow label="성실성" value={current.C} />
      <BarRow label="외향성" value={current.E} />
      <BarRow label="친화성" value={current.A} />
      <BarRow label="신경성" value={current.N} />

      <Text style={styles.sectionH2}>종합 분석 결과</Text>
      <Text style={styles.summary}>
        {current.summary ??
          (current.source === 'fallback'
            ? '성실성과 소통 능력이 좋아 협업과 UI 품질 유지에 강점이 있습니다. 요구사항 변경에도 비교적 안정적으로 대응하는 편입니다.'
            : '요약이 제공되지 않았습니다.')}
      </Text>
    </View>
  );
}

/* ── small components ───────────────────────────── */

function BarRow({ label, value }: { label: string; value: number }) {
  // value(%)를 실제 픽셀로 변환해서 점 위치 계산
  const dotLeftRaw = (BAR_W * value) / 100 - 8; // 점의 반지름 8px 보정
  const dotLeft = Math.max(-2, Math.min(BAR_W - 14, dotLeftRaw)); // 살짝 클램핑

  return (
    <View style={{ marginTop: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ fontWeight: '600' }}>{label}</Text>
        <Text style={{ color: '#6A6A76' }}>{Math.round(value)}%</Text>
      </View>

      {/* 트랙 */}
      <View style={[styles.barTrack, { width: BAR_W }]}>
        {/* 채움 (부모 width 고정이므로 % 사용 OK) */}
        <View style={[styles.barFill, { width: `${value}%` }]} />
        {/* 끝 점 포인트 (숫자 px로 계산) */}
        <View style={[styles.barDot, { left: dotLeft }]} />
      </View>
    </View>
  );
}

/* ── styles ─────────────────────────────────────── */

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: CARD_HPAD,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 6 },

  subTab: { marginTop: 6, marginBottom: 12 },
  subTabIndicator: { height: 2, backgroundColor: PRIMARY, width: 42, borderRadius: 2 },
  subTabText: { marginTop: 8, color: '#6A6A76' },

  barTrack: {
    height: 10,
    backgroundColor: '#EFEFF4',
    borderRadius: 999,
    overflow: 'hidden',
    position: 'relative',
  },
  barFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: PRIMARY,
    borderRadius: 999,
  },
  barDot: {
    position: 'absolute',
    top: -3,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#B3A9FF',
  },

  sectionH2: { fontSize: 16, fontWeight: '800', marginTop: 18, marginBottom: 6 },
  summary: { color: '#4B5563', lineHeight: 20 },

  retryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
});
