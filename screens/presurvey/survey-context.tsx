// screens/presurvey/survey-context.tsx
import React, { createContext, useContext, useMemo, useState } from 'react';

/** -------- 라우트: _layout.tsx와 반드시 이름 통일 -------- */
export const ROUTES = {
  intro: '/presurvey/intro',
  age: '/presurvey/age',
  gender: '/presurvey/gender',
  education: '/presurvey/education',
  experience: '/presurvey/experience',
  experienceDetail: '/presurvey/experience-detail',
  economySaving: '/presurvey/economy-saving',
  economySpending: '/presurvey/economy-spending',
  relationship: '/presurvey/relationship', // ← 너의 _layout에 맞춤
  mood: '/presurvey/mood',
  stress: '/presurvey/stress',
  confirm: '/presurvey/confirm',
} as const;

/** -------- 코드 매핑 상수 -------- */
// 성별
export const GENDER_CODE = { '남자': 1, '여자': 2, '밝히고 싶지 않음': 3 } as const;

// 학력
export const EDUCATION_CODE = {
  '중학교 졸업 이하': 1,
  '고등학교 졸업': 2,
  '2~3년제 대학교 졸업': 3,
  '4년제 대학교 졸업': 4,
  '대학원 이상': 5,
} as const;

// 저축 (full 문장 → 코드)
export const SAVING_CODE: Record<string, 1|2|3|4> = {
  '🚫 저축할 여유가 없다': 1,
  '💰 조금씩이라도 저축 중이다': 2,
  '📅 매달 일정 금액 이상 저축 중이다': 3,
  '📈 저축 외에도 투자까지 여유가 있다': 4,
} as const;

// 생활비 (full 문장 → 코드)
export const SPENDING_CODE: Record<string, 1|2|3|4> = {
  '🚫 생활비도 빠듯해 기본적인 지출이 어렵다': 1,
  '🧾 기본 생활비는 가능한 수준이다': 2,
  '👜 여유 있게 쓰고 약간의 소비도 가능하다': 3,
  '🎯 원하는 취미나 자기계발에도 충분히 투자할 수 있다': 4,
} as const;

// 대인관계
export const REL_FREQ_CODE = { '없음': 1, '보통': 3, '활발': 5 } as const;
export const REL_STYLE_CODE = { '깊고 좁게': 1, '넓고 얕게': 2 } as const;

// 감정/스트레스 (full 문장 → 코드)
export const MOOD_CODE: Record<string, 1|2|3|4> = {
  '😊 감정이 안정적이고 쉽게 흔들리지 않아요': 1,
  '🙂 약간의 기복은 있지만 스스로 잘 조절해요': 2,
  '😕 기분 변화가 가끔 심한 편이에요': 3,
  '😣 감정 기복이 크고, 컨트롤이 잘 안 될 때도 있어요': 4,
} as const;

export const STRESS_CODE: Record<string, 1|2|3|4> = {
  '✨ 운동이나 산책 같은 신체 활동을 해요': 1,
  '💡 음악을 듣거나 영화를 보며 혼자만의 시간을 보내요': 2,
  '🗣️ 가족이나 친구와 대화하면서 스트레스를 풀어요': 3,
  '😶 뚜렷한 해소 방법이 없어서 그냥 버티는 편이에요': 4,
} as const;



/** -------- 타입 -------- */
export type ExperienceItem = { field: string; years: number; months: number };

export type SurveyData = {
   // 0 (인트로)
  introVisited?: boolean; // 인트로 화면을 봤는지 여부
  // 1
  age?: number;
  // 2
  gender?: '남자' | '여자' | '밝히고 싶지 않음';
  genderCode?: 1 | 2 | 3;
  // 3
  educationCode?: 1 | 2 | 3 | 4 | 5;
  education?:
    | '중학교 졸업 이하'
    | '고등학교 졸업'
    | '2~3년제 대학교 졸업'
    | '4년제 대학교 졸업'
    | '대학원 이상';
  // 4
  hasExperience?: boolean;
  experiences: ExperienceItem[]; // 최대 2개까지 화면에서 컨트롤
  // 5
  // 저축 (코드 + 라벨)
  savingCode?: 1 | 2 | 3 | 4;
  savingFull?: string;
  savingShort?: string;
  // 6
  spendingCode?: 1 | 2 | 3 | 4;
  spendingFull?: string;
  spendingShort?: string;
  // 6(대인관계)
  // 대인관계 (코드 + 라벨)
  relationFreqCode?: 1 | 3 | 5;
  relationFreq?: '없음' | '보통' | '활발';
  relationStyleCode?: 1 | 2;
  relationStyle?: '깊고 좁게' | '넓고 얕게';
  // 감정 (코드 + 라벨)
  moodCode?: 1 | 2 | 3 | 4;
  moodFull?: string;
  moodShort?: string;
  // 스트레스 (코드 + 라벨)
  stressCode?: 1 | 2 | 3 | 4;
  stressFull?: string;
  stressShort?: string;
};

export type SurveyContextType = {
  data: SurveyData;
  setData: (patch: Partial<SurveyData>) => void;
  resetData: () => void;

  // 유틸(경력 항목 편집 시 편하게 쓰라고 제공)
  upsertExperience: (index: number, value: ExperienceItem) => void;
  removeExperience: (index: number) => void;

  // 긴 문장을 짧은 라벨로 저장하는 헬퍼
  chooseSaving: (full: string) => void;
  chooseSpending: (full: string) => void;
  chooseMood: (full: string) => void;
  chooseStress: (full: string) => void;

  // 표기 유틸(확인화면 등에서 사용)
  formatExperience: (e: ExperienceItem) => string;
};

/** -------- 라벨 → 쇼트라벨 -------- */
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

/** -------- 초기값 -------- */
const initialData: SurveyData = {
  experiences: [],
};


/** -------- Context 구현 -------- */
const SurveyContext = createContext<SurveyContextType | null>(null);

export const SurveyProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setDataState] = useState<SurveyData>(initialData);

  const setData = (patch: Partial<SurveyData>) => {
    setDataState(prev => ({ ...prev, ...patch }));
  };
  const resetData = () => setDataState(initialData);

  const upsertExperience = (index: number, value: ExperienceItem) => {
    setDataState(prev => {
      const copy = [...prev.experiences];
      if (index > copy.length) index = copy.length;
      copy[index] = value;
      return { ...prev, experiences: copy.slice(0, 2) };
    });
  };
  const removeExperience = (index: number) => {
    setDataState(prev => {
      const copy = prev.experiences.filter((_, i) => i !== index);
      return { ...prev, experiences: copy };
    });
  };

 // 맵에서 안전하게 코드 꺼내기
const codeOf = <T extends Record<string, number>>(table: T, full?: string) =>
  (full ? table[full as keyof T] : undefined) as T[keyof T] | undefined;

// 사용 예시
  const chooseSaving = (full: string) => {
    setData({
      savingFull: full,
      savingShort: SAVING_SHORT[full] ?? full,
      savingCode: codeOf(SAVING_CODE, full),
  });
  };
  const chooseSpending = (full: string) => {
    setData({
      spendingFull: full,
      spendingShort: SPENDING_SHORT[full] ?? full,
      spendingCode: codeOf(SPENDING_CODE, full),
    });
  };
  const chooseMood = (full: string) => {
    setData({
      moodFull: full,
      moodShort: MOOD_SHORT[full] ?? full,
      moodCode: codeOf(MOOD_CODE, full),
    });
  };
  const chooseStress = (full: string) => {
    setData({
      stressFull: full,
      stressShort: STRESS_SHORT[full] ?? full,
      stressCode: codeOf(STRESS_CODE, full),
    });
  };


  const formatExperience = (e: ExperienceItem) => {
    const y = e.years ?? 0;
    const m = e.months ?? 0;
    if (y > 0 && m > 0) return `${e.field} · ${y}년차 ${m}개월`;
    if (y > 0 && m === 0) return `${e.field} · ${y}년차`;
    if (y === 0 && m > 0) return `${e.field} · ${m}개월`;
    return `${e.field}`;
  };

  const value = useMemo<SurveyContextType>(() => ({
    data,
    setData,
    resetData,
    upsertExperience,
    removeExperience,
    chooseSaving,
    chooseSpending,
    chooseMood,
    chooseStress,
    formatExperience,
  }), [data]);

  return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>;
};

export const useSurvey = () => {
  const ctx = useContext(SurveyContext);
  if (!ctx) throw new Error('useSurvey must be used within SurveyProvider');
  return ctx;
};