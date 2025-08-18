import React, { createContext, useContext, useMemo, useState } from 'react';
import { TOTAL_QUESTIONS } from './questions';

type Likert = 1 | 2 | 3 | 4 | 5;

// ✅ Q47 허용 라벨(공백/이모지 제거된 저장형과 일치시키는 걸 권장)
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
      // priorityOrder 타입 보강: 런타임에서도 안전하게 필터
      if (k === 'priorityOrder' && Array.isArray(v)) {
        const allowed: PriorityKey[] = [
          '나이',
          '성별',
          '경제상황및대인관계',
          '성격',
          '흥미',
          '관심분야',
        ];
        const filtered = (v as PriorityKey[]).filter(x => allowed.includes(x));
        setData(prev => ({ ...prev, [k]: filtered }));
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

    // (선택) 제출 전 검증: 필요 시 Confirm 화면에서 사용
    const validate: Ctx['validate'] = () => {
      // Likert 최소 응답 여부만 체크하고, 나머지는 Confirm에서 추가 검증 가능
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
