// screens/survey/survey-context.tsx
import React, { createContext, useContext, useMemo, useState } from 'react';
import { TOTAL_QUESTIONS } from './questions';

type Likert = 1 | 2 | 3 | 4 | 5;

// ✅ Q47 허용 라벨(저장형 키)
export type PriorityKey =
  | '나이'
  | '성별'
  | '경제상황및대인관계'
  | '성격'
  | '흥미'
  | '관심분야';

export type SurveyData = {
  // 1~44 Likert
  likert: (Likert | null)[];
  // 45
  interestField?: string;
  // 46 (연봉: 연 단위 정수)
  desiredSalaryYear?: number;
  // 47 (라벨 6개 순서)
  priorityOrder?: PriorityKey[];
};

type Ctx = {
  data: SurveyData;
  setLikert: (index1to44: number, v: Likert) => void;
  setField: <K extends keyof SurveyData>(k: K, v: SurveyData[K]) => void;
  reset: () => void;
  // (선택) 제출 전 검증 도우미
  validate?: () => { ok: boolean; reason?: string };
};

const LIKERT_COUNT = 44;

/** ──────────────────────────────────────────────────────────
 *  Q47 라벨 정규화
 *  - 공백/제로폭문자/일부 특수문자/이모지 제거
 *  - '경제상황 및 대인관계' → '경제상황및대인관계'
 *  - 허용 키 외 값은 null
 *  ────────────────────────────────────────────────────────── */
const allowedPriority: PriorityKey[] = [
  '나이',
  '성별',
  '경제상황및대인관계',
  '성격',
  '흥미',
  '관심분야',
];

const normalizePriorityLabel = (s: string): PriorityKey | null => {
  if (!s) return null;
  // 공백/제로폭 제거
  let t = s.replace(/[\s\u200B-\u200D\uFEFF]/g, '');
  // 이모지/기타 특수문자 제거(한글/숫자/영문/밑줄만 남김)
  t = t.replace(/[^\w가-힣]/g, '');

  // 공백 제거만 해도 대부분 해결됨
  // 테이블 매핑(필요시 별칭 추가 가능)
  const table: Record<string, PriorityKey> = {
    '나이': '나이',
    '성별': '성별',
    '성격': '성격',
    '흥미': '흥미',
    '관심분야': '관심분야',
    '경제상황및대인관계': '경제상황및대인관계', // '경제상황 및 대인관계' → 공백제거 후 키 일치
  };

  return table[t] ?? null;
};

const SurveyContext = createContext<Ctx | null>(null);

export function SurveyProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SurveyData>({
    likert: Array(LIKERT_COUNT).fill(null),
  });

  const api = useMemo<Ctx>(() => {
    const setLikert: Ctx['setLikert'] = (index1to44, v) => {
      if (index1to44 < 1 || index1to44 > LIKERT_COUNT) {
        console.warn('setLikert: index out of range', index1to44);
        return;
      }
      setData(prev => {
        const arr = [...prev.likert];
        arr[index1to44 - 1] = v;
        return { ...prev, likert: arr };
      });
    };

    const setField: Ctx['setField'] = (k, v) => {
      if (k === 'priorityOrder' && Array.isArray(v)) {
        // 1) 라벨 정규화 → 2) 허용 키 필터 → 3) 중복 제거 → 4) 최대 6개
        const normalized = (v as string[])
          .map(s => normalizePriorityLabel(s))
          .filter((x): x is PriorityKey => !!x && allowedPriority.includes(x));

        const dedup: PriorityKey[] = [];
        normalized.forEach(x => {
          if (!dedup.includes(x)) dedup.push(x);
        });

        const finalArr = dedup.slice(0, 6);
        setData(prev => ({ ...prev, priorityOrder: finalArr }));
        return;
      }
      setData(prev => ({ ...prev, [k]: v }));
    };

    const reset: Ctx['reset'] = () =>
      setData({
        likert: Array(LIKERT_COUNT).fill(null),
        interestField: undefined,
        desiredSalaryYear: undefined,
        priorityOrder: undefined,
      });

    const validate: Ctx['validate'] = () => {
      const allLikertAnswered = (data.likert ?? []).every(v => v !== null);
      if (!allLikertAnswered) {
        return { ok: false, reason: '성격/흥미 문항(1~44)을 모두 선택해 주세요.' };
      }
      if (!data.interestField || data.interestField.trim().length === 0) {
        return { ok: false, reason: '관심 분야(45번)를 입력해 주세요.' };
      }
      if (
        typeof data.desiredSalaryYear !== 'number' ||
        !Number.isFinite(data.desiredSalaryYear) ||
        data.desiredSalaryYear <= 0
      ) {
        return { ok: false, reason: '최소 희망 연봉(46번)을 숫자로 입력해 주세요.' };
      }
      if (!data.priorityOrder || data.priorityOrder.length !== 6) {
        return { ok: false, reason: '우선순위(47번) 6개 항목을 모두 순서대로 선택해 주세요.' };
      }
      return { ok: true };
    };

    return { data, setLikert, setField, reset, validate };
  }, [data]);

  return <SurveyContext.Provider value={api}>{children}</SurveyContext.Provider>;
}

export const useSurvey = () => {
  const ctx = useContext(SurveyContext);
  if (!ctx) throw new Error('useSurvey must be used within SurveyProvider');
  return ctx;
};

export const useProgress = (currentIndex1to47: number) => {
  const pct = Math.round((currentIndex1to47 / TOTAL_QUESTIONS) * 100);
  return { current: currentIndex1to47, total: TOTAL_QUESTIONS, pct };
};
