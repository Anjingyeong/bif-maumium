/**
 * 경계선 지능 선별 체크리스트 문항 데이터
 * 
 * 참고: 한국교육과정평가원 선별 체크리스트, 서울시 경계선지능인 평생교육지원센터,
 * DSM-5 경계선 지적 기능 기준을 참고하여 구성
 * 
 * 주의: 이 체크리스트는 의학적 진단을 대체하지 않으며, 전문가 상담의 필요성을
 * 판단하기 위한 선별 목적으로만 사용됩니다.
 */

export interface Question {
  id: number;
  text: string;
  category: string;
}

export interface QuestionSet {
  title: string;
  description: string;
  targetAge: string;
  questions: Question[];
  disclaimer: string;
}

export const adultQuestions: QuestionSet = {
  title: "성인 자가진단",
  description: "본인의 일상생활과 인지 능력을 스스로 점검해보는 체크리스트입니다.",
  targetAge: "만 18세 이상 성인",
  disclaimer: "이 검사는 의학적 진단을 대체하지 않습니다. 결과에 따라 전문가 상담을 권장드립니다.",
  questions: [
    { id: 1, text: "새로운 내용을 배울 때 다른 사람보다 반복 설명이 더 많이 필요합니다.", category: "학습" },
    { id: 2, text: "복잡한 지시사항을 한 번에 이해하기 어렵습니다.", category: "학습" },
    { id: 3, text: "돈 계산이나 거스름돈 확인에 어려움을 느낍니다.", category: "인지" },
    { id: 4, text: "시간 관리(약속 시간 지키기, 일정 계획 등)가 어렵습니다.", category: "인지" },
    { id: 5, text: "여러 단계로 이루어진 작업을 순서대로 수행하기 힘듭니다.", category: "인지" },
    { id: 6, text: "대화 중 상대방의 의도나 비유적 표현을 이해하기 어렵습니다.", category: "사회성" },
    { id: 7, text: "사회적 상황에서 적절한 반응을 하지 못해 오해를 받은 적이 있습니다.", category: "사회성" },
    { id: 8, text: "감정 조절이 어려워 충동적으로 반응할 때가 있습니다.", category: "정서" },
    { id: 9, text: "장기적인 목표를 세우고 실행하는 것이 부담스럽습니다.", category: "실행기능" },
    { id: 10, text: "일상적인 업무에서 같은 실수를 반복합니다.", category: "실행기능" },
    { id: 11, text: "글을 읽을 때 내용을 파악하는 데 시간이 오래 걸립니다.", category: "학습" },
    { id: 12, text: "새로운 환경이나 변화에 적응하는 데 시간이 많이 필요합니다.", category: "적응" },
    { id: 13, text: "집중력을 오래 유지하기 어렵습니다.", category: "인지" },
    { id: 14, text: "다른 사람의 말을 쉽게 믿어 손해를 본 경험이 있습니다.", category: "사회성" },
    { id: 15, text: "서류 작성이나 행정 업무 처리가 어렵게 느껴집니다.", category: "적응" },
  ]
};

export const childQuestions: QuestionSet = {
  title: "아동 선별검사 (학부모용)",
  description: "자녀의 발달 및 학습 특성을 관찰하여 응답해주세요.",
  targetAge: "만 5세 ~ 만 15세 아동·청소년",
  disclaimer: "이 검사는 의학적 진단을 대체하지 않습니다. 결과에 따라 전문기관 방문을 권장드립니다.",
  questions: [
    { id: 1, text: "또래에 비해 말을 배우는 속도가 느렸습니다.", category: "언어발달" },
    { id: 2, text: "간단한 지시를 여러 번 반복해야 이해합니다.", category: "인지" },
    { id: 3, text: "학교 수업 내용을 따라가는 데 어려움이 있습니다.", category: "학습" },
    { id: 4, text: "같은 학년 아이들에 비해 읽기나 쓰기 능력이 부족합니다.", category: "학습" },
    { id: 5, text: "숫자 개념이나 기본적인 수학 연산에 어려움을 보입니다.", category: "학습" },
    { id: 6, text: "새로운 것을 배울 때 반복 학습이 많이 필요합니다.", category: "학습" },
    { id: 7, text: "또래 친구들과 어울리는 데 어려움이 있습니다.", category: "사회성" },
    { id: 8, text: "상황에 맞지 않는 행동을 할 때가 있습니다.", category: "사회성" },
    { id: 9, text: "감정 표현이 또래에 비해 미숙합니다.", category: "정서" },
    { id: 10, text: "주의 집중 시간이 또래보다 짧습니다.", category: "인지" },
    { id: 11, text: "스스로 일상생활(옷 입기, 정리정돈 등)을 하는 데 도움이 필요합니다.", category: "적응" },
    { id: 12, text: "규칙이나 순서를 이해하고 따르는 것이 어렵습니다.", category: "인지" },
    { id: 13, text: "발음이 부정확하거나 문장 구성이 또래보다 미숙합니다.", category: "언어발달" },
    { id: 14, text: "새로운 환경에 적응하는 데 시간이 오래 걸립니다.", category: "적응" },
    { id: 15, text: "또래에 비해 호기심이나 질문이 적은 편입니다.", category: "인지" },
    { id: 16, text: "게임이나 놀이의 규칙을 이해하는 데 어려움이 있습니다.", category: "인지" },
    { id: 17, text: "시험이나 평가에서 문제의 의도를 파악하지 못합니다.", category: "학습" },
    { id: 18, text: "자기 생각이나 경험을 말로 표현하는 것이 서툽니다.", category: "언어발달" },
  ]
};

export type AnswerValue = 0 | 1 | 2 | 3;

export const answerOptions = [
  { value: 0 as AnswerValue, label: "전혀 그렇지 않다" },
  { value: 1 as AnswerValue, label: "가끔 그렇다" },
  { value: 2 as AnswerValue, label: "자주 그렇다" },
  { value: 3 as AnswerValue, label: "항상 그렇다" },
];

export interface ResultLevel {
  min: number;
  max: number;
  level: string;
  title: string;
  description: string;
  recommendation: string;
  color: string;
}

export const adultResultLevels: ResultLevel[] = [
  {
    min: 0, max: 10,
    level: "low",
    title: "일상생활 잘 유지 중",
    description: "응답 결과, 현재 일상에서 큰 어려움 없이 잘 지내고 계신 것으로 보입니다. 지금처럼 스스로를 돌보는 것이 중요합니다.",
    recommendation: "지금 이대로 충분합니다. 앞으로도 자신의 강점을 살려 생활하시고, 가끔 스트레스 해소와 충분한 휴식을 취해 주세요.",
    color: "oklch(0.65 0.15 145)" // Green
  },
  {
    min: 11, max: 22,
    level: "mild",
    title: "가벼운 어려움 있음",
    description: "일부 영역에서 약간의 어려움이 느껴지시는 것 같습니다. 이는 피로, 스트레스, 또는 환경의 변화 때문일 수도 있습니다.",
    recommendation: "지금 당장 크게 걱정하실 필요는 없습니다. 비슷한 어려움이 계속된다면 가까운 심리상담센터에서 편하게 이야기 나눠보시는 것도 좋은 방법입니다.",
    color: "oklch(0.7 0.12 85)" // Amber
  },
  {
    min: 23, max: 33,
    level: "moderate",
    title: "전문가 상담 권장",
    description: "여러 영역에서 어려움이 느껴지시는 것 같습니다. 혼자 감당하기 버거우셨을 수도 있습니다. 전문가의 도움을 받으시면 훨씬 편해질 수 있습니다.",
    recommendation: "정신건강의학과 또는 심리상담센터를 방문해 전문적인 상담을 받아보시기를 권장합니다. 도움을 요청하는 것은 용기 있는 일입니다.",
    color: "oklch(0.65 0.15 30)" // Coral
  },
  {
    min: 34, max: 45,
    level: "high",
    title: "전문가 상담 적극 권장",
    description: "여러 영역에서 상당한 어려움이 느껴지시는 것 같습니다. 지금까지 많이 힘드셨을 텐데, 혼자 버텨오신 것만으로도 대단합니다.",
    recommendation: "전문기관의 도움을 받으시면 지금보다 훨씬 편안한 일상을 만들어 갈 수 있습니다. 정신건강의학과나 심리상담센터에 방문해 종합적인 상담을 받아보세요. 조기에 지원을 받을수록 더 큰 도움이 됩니다.",
    color: "oklch(0.55 0.2 25)" // Deep Coral
  },
];

export const childResultLevels: ResultLevel[] = [
  {
    min: 0, max: 12,
    level: "low",
    title: "또래와 비슷하게 잘 성장 중",
    description: "응답 결과, 자녀가 또래 수준에서 건강하게 성장하고 있는 것으로 보입니다. 지금처럼 따뜻한 관심을 계속 보내주세요.",
    recommendation: "지금처럼 자녀를 응원하고 지지해 주세요. 아이의 작은 성취에 칭찬을 아끼지 않는 것이 가장 큰 힘이 됩니다.",
    color: "oklch(0.65 0.15 145)"
  },
  {
    min: 13, max: 26,
    level: "가벼운 지원 도움 될 수 있음",
    title: "가벼운 지원 도움 될 수 있음",
    description: "일부 영역에서 또래보다 조금 더 시간이 필요한 부분이 있는 것 같습니다. 아이마다 발달 속도는 다를 수 있으니 너무 걱정하지 않으셔도 됩니다.",
    recommendation: "담임선생님과 편하게 이야기 나눠보시고, 가정에서 반복 학습과 칭찬으로 자신감을 키워주세요. 6개월 후 다시 한번 살펴보시는 것도 좋습니다.",
    color: "oklch(0.7 0.12 85)"
  },
  {
    min: 27, max: 40,
    level: "moderate",
    title: "전문가 상담 권장",
    description: "여러 영역에서 또래보다 조금 더 어려움을 겪고 있는 것으로 보입니다. 아이가 그동안 많이 애썼을 텐데, 적절한 지원을 받으면 훨씬 편안해질 수 있습니다.",
    recommendation: "소아정신건강의학과나 발달센터에서 전문가와 편하게 상담해 보세요. 전문적인 지원은 아이의 가능성을 더 크게 열어줍니다.",
    color: "oklch(0.65 0.15 30)"
  },
  {
    min: 41, max: 54,
    level: "high",
    title: "전문가 상담 적극 권장",
    description: "여러 영역에서 어려움이 있는 것으로 보입니다. 부모님도 많이 걱정되고 힘드셨을 텐데, 지금 이렇게 관심을 갖고 계신 것 자체가 아이에게 큰 힘이 됩니다.",
    recommendation: "전문기관의 도움을 받으시면 아이에게 맞는 지원 방법을 찾을 수 있습니다. 소아정신건강의학과나 발달센터를 방문해 종합적인 상담을 받아보세요. 일찍 시작할수록 아이의 성장에 더 큰 도움이 됩니다.",
    color: "oklch(0.55 0.2 25)"
  },
];

export function getResultLevel(score: number, type: 'adult' | 'child'): ResultLevel {
  const levels = type === 'adult' ? adultResultLevels : childResultLevels;
  return levels.find(l => score >= l.min && score <= l.max) || levels[levels.length - 1];
}

export function getCategoryScores(answers: Record<number, AnswerValue>, questions: Question[]): Record<string, { score: number; max: number }> {
  const categories: Record<string, { score: number; max: number }> = {};
  
  questions.forEach(q => {
    if (!categories[q.category]) {
      categories[q.category] = { score: 0, max: 0 };
    }
    categories[q.category].max += 3;
    if (answers[q.id] !== undefined) {
      categories[q.category].score += answers[q.id];
    }
  });
  
  return categories;
}

export const supportResources = [
  {
    name: "정신건강위기상담전화",
    phone: "1577-0199",
    description: "24시간 정신건강 상담",
  },
  {
    name: "서울시 경계선지능인 평생교육지원센터",
    url: "https://sbifc.org",
    description: "경계선 지능인 선별검사 및 교육 지원",
  },
  {
    name: "국가기초학력지원포털",
    url: "https://www.basics.re.kr",
    description: "학부모용 경계선지능 선별 체크리스트",
  },
  {
    name: "Wee센터",
    phone: "1588-7179",
    description: "학생 상담 및 심리검사 지원",
  },
  {
    name: "발달장애인지원센터",
    phone: "1644-8295",
    description: "발달장애 관련 종합 지원",
  },
];
