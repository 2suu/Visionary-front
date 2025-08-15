import React, { createContext, useContext, useMemo, useState } from 'react';
import { TOTAL_QUESTIONS } from './questions';

type Likert = 1|2|3|4|5;

export type SurveyData = {
  likert: (Likert | null)[]; // 1~44 Likert
  interestField?: string;    // 45
  desiredSalaryYear?: number; // 46
  priorityOrder?: string[];  // 47
};

type Ctx = {
  data: SurveyData;
  setLikert: (index1to44: number, v: Likert) => void;
  setField: <K extends keyof SurveyData>(k: K, v: SurveyData[K]) => void;
  reset: () => void;
};

const SurveyContext = createContext<Ctx | null>(null);

export function SurveyProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SurveyData>({
    likert: Array(44).fill(null),
  });

  const api = useMemo<Ctx>(() => ({
    data,
    setLikert: (index1to44, v) => {
      setData(prev => {
        const arr = [...prev.likert];
        arr[index1to44 - 1] = v;
        return { ...prev, likert: arr };
      });
    },
    setField: (k, v) => setData(prev => ({ ...prev, [k]: v })),
    reset: () => setData({ likert: Array(44).fill(null) }),
  }), [data]);

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