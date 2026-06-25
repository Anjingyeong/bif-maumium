/**
 * 학습·인지·적응기능 선별 체크리스트 문항 데이터
 *
 * 표준화 지능검사(K-WAIS/K-WISC 등), 적응행동검사(Vineland, ABAS, NISE-K·ABS 등)의
 * 평가 영역 구조를 참고하되, 실제 검사 문항을 복제하지 않고 자체 행동 관찰 문항으로 구성했습니다.
 *
 * 주의: 이 체크리스트는 진단 도구가 아니라 선별용 자가체크입니다.
 * 정확한 평가는 임상심리사, 정신건강의학과, 특수교육 전문가 등이 실시하는
 * 표준화 지능검사와 적응행동검사, 면담을 통해 이루어져야 합니다.
 */

import {
  DIFFERENTIAL_GUIDANCE,
  SCREENING_DISCLAIMER,
  getRiskLevelDisplay,
  getRiskResultDescription,
} from "./riskLevels";

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
  title: "성인 학습·인지·적응기능 자가체크",
  description: "일상생활, 학업·직업 상황에서의 학습·인지·적응기능 어려움 가능성을 점검하는 선별 체크리스트입니다.",
  targetAge: "만 18세 이상 성인",
  disclaimer: `${SCREENING_DISCLAIMER} ${DIFFERENTIAL_GUIDANCE}`,
  questions: [
    { id: 1, text: "새로운 내용을 배울 때 한 번의 설명보다 반복 설명이나 예시가 더 도움이 됩니다.", category: "학습/개념 이해" },
    { id: 2, text: "설명을 들은 직후에도 실제로 따라 하려면 단계별 안내가 필요할 때가 있습니다.", category: "작업기억" },
    { id: 3, text: "글이나 안내문을 읽고 핵심 내용을 파악하는 데 시간이 비교적 오래 걸립니다.", category: "처리속도" },
    { id: 4, text: "약속, 마감, 준비물을 스스로 계획하고 챙기는 과정에서 자주 도움 도구가 필요합니다.", category: "실행기능" },
    { id: 5, text: "여러 단계가 있는 업무나 집안일을 순서대로 진행할 때 중간 단계를 놓치기 쉽습니다.", category: "실행기능" },
    { id: 6, text: "대화에서 농담, 비유, 돌려 말하는 표현의 뜻을 확인해야 할 때가 있습니다.", category: "사회적 판단" },
    { id: 7, text: "낯선 사람의 부탁이나 제안을 판단할 때 주변 사람의 조언이 도움이 될 때가 있습니다.", category: "사회적 판단" },
    { id: 8, text: "피로, 불안, 스트레스, 수면부족이 있을 때 집중과 판단이 평소보다 크게 흔들립니다.", category: "정서/주의/수면 등 혼동 요인" },
    { id: 9, text: "장기 목표를 작은 단계로 나누고 꾸준히 실행하는 데 구조화된 계획표가 필요합니다.", category: "실행기능" },
    { id: 10, text: "반복되는 업무에서 체크리스트가 없으면 같은 실수나 누락이 생기기 쉽습니다.", category: "학업/직업 적응" },
    { id: 11, text: "새로운 개념이나 용어를 이해하려면 구체적인 사례와 충분한 연습 시간이 필요합니다.", category: "학습/개념 이해" },
    { id: 12, text: "새로운 장소, 절차, 사람에 익숙해지는 데 시간이 더 필요합니다.", category: "일상생활 적응" },
    { id: 13, text: "해야 할 일을 시작하거나 유지할 때 주변 소음, 걱정, 피로의 영향을 많이 받습니다.", category: "정서/주의/수면 등 혼동 요인" },
    { id: 14, text: "계약, 결제, 행정 서류처럼 책임이 따르는 선택을 할 때 내용을 함께 확인해 줄 사람이 있으면 안전합니다.", category: "일상생활 적응" },
    { id: 15, text: "서류 작성, 온라인 신청, 공공기관 절차를 혼자 처리할 때 순서 안내가 필요합니다.", category: "학업/직업 적응" },
  ]
};

export const childQuestions: QuestionSet = {
  title: "아동 학습·인지·적응기능 선별검사 (보호자용)",
  description: "자녀의 최근 6개월간 학습, 인지, 사회적 판단, 일상 적응 모습을 관찰하여 응답해 주세요.",
  targetAge: "만 5세 ~ 만 15세 아동·청소년",
  disclaimer: `${SCREENING_DISCLAIMER} ${DIFFERENTIAL_GUIDANCE}`,
  questions: [
    { id: 1, text: "새로운 단어나 개념을 익힐 때 반복 설명과 구체적인 예시가 도움이 됩니다.", category: "학습/개념 이해" },
    { id: 2, text: "두세 단계 이상의 지시를 들으면 중간 내용을 다시 확인해야 할 때가 있습니다.", category: "작업기억" },
    { id: 3, text: "수업 내용을 이해하고 과제를 시작하기까지 또래보다 시간이 더 필요해 보입니다.", category: "학업/직업 적응" },
    { id: 4, text: "읽기나 쓰기 과제를 할 때 속도, 정확도, 이해 중 한 가지 이상에서 꾸준한 지원이 필요합니다.", category: "학습/개념 이해" },
    { id: 5, text: "수 개념이나 기본 연산을 익힐 때 시각 자료, 손가락, 구체물 같은 보조 단서가 도움이 됩니다.", category: "학습/개념 이해" },
    { id: 6, text: "새로운 활동을 배운 뒤 혼자 적용하기까지 여러 번의 연습 기회가 필요합니다.", category: "처리속도" },
    { id: 7, text: "또래와 놀이하거나 대화할 때 차례, 규칙, 상대 반응을 확인해 주면 더 잘 참여합니다.", category: "사회적 판단" },
    { id: 8, text: "상황이 바뀌거나 예상과 다를 때 어떤 행동을 하면 좋을지 안내가 필요할 때가 있습니다.", category: "사회적 판단" },
    { id: 9, text: "감정이 커졌을 때 말로 표현하거나 진정하는 방법을 어른이 함께 정리해 주면 도움이 됩니다.", category: "정서/주의/수면 등 혼동 요인" },
    { id: 10, text: "피로, 수면부족, 걱정, 산만한 환경에서 집중 유지가 평소보다 크게 어려워집니다.", category: "정서/주의/수면 등 혼동 요인" },
    { id: 11, text: "옷 입기, 준비물 챙기기, 정리정돈 같은 일상 루틴에서 시각 단서나 확인이 필요합니다.", category: "일상생활 적응" },
    { id: 12, text: "규칙이나 순서를 알고 있어도 실제 상황에서 바로 적용하려면 다시 짚어 주는 과정이 필요합니다.", category: "실행기능" },
    { id: 13, text: "자신의 생각이나 경험을 말로 설명할 때 질문을 나누어 주면 더 잘 표현합니다.", category: "작업기억" },
    { id: 14, text: "새로운 교실, 선생님, 일정 변화에 익숙해지는 데 예고와 적응 시간이 필요합니다.", category: "일상생활 적응" },
    { id: 15, text: "과제나 준비물을 스스로 시작하고 마무리하기 위해 체크리스트나 어른의 확인이 도움이 됩니다.", category: "실행기능" },
    { id: 16, text: "게임이나 놀이 규칙을 처음 배울 때 말 설명보다 시범과 반복 연습이 도움이 됩니다.", category: "처리속도" },
    { id: 17, text: "시험이나 평가에서 문제를 읽고 요구하는 행동을 파악하도록 밑줄, 예시, 추가 설명이 도움이 됩니다.", category: "학업/직업 적응" },
    { id: 18, text: "학교생활에서 필요한 준비, 이동, 제출 같은 절차를 익히는 데 반복적인 안내가 필요합니다.", category: "학업/직업 적응" },
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
    title: getRiskLevelDisplay("low").resultTitle,
    description: getRiskResultDescription("low", "adult"),
    recommendation: `지금처럼 일상 루틴과 강점을 유지해 주세요. 특정 어려움이 새로 생기거나 오래 지속된다면 상담이나 평가를 통해 원인을 확인할 수 있습니다. ${DIFFERENTIAL_GUIDANCE}`,
    color: getRiskLevelDisplay("low").resultColor
  },
  {
    min: 11, max: 22,
    level: "caution",
    title: getRiskLevelDisplay("caution").resultTitle,
    description: getRiskResultDescription("caution", "adult"),
    recommendation: "어려움이 반복되거나 학업·직업·대인관계에 영향을 준다면 상담이나 검사를 권합니다. 최근 컨디션과 생활 변화도 함께 기록해 보세요.",
    color: getRiskLevelDisplay("caution").resultColor
  },
  {
    min: 23, max: 45,
    level: "consult",
    title: getRiskLevelDisplay("consult").resultTitle,
    description: getRiskResultDescription("consult", "adult"),
    recommendation: "임상심리사, 정신건강의학과, 상담센터 등에서 표준화 지능검사와 적응행동검사, 면담을 포함한 평가를 받아보는 것을 권합니다. 필요한 지원을 찾기 위한 참고 자료로 활용해 주세요.",
    color: getRiskLevelDisplay("consult").resultColor
  },
];

export const childResultLevels: ResultLevel[] = [
  {
    min: 0, max: 12,
    level: "low",
    title: getRiskLevelDisplay("low").resultTitle,
    description: getRiskResultDescription("low", "child"),
    recommendation: `지금처럼 자녀의 강점과 작은 성취를 지지해 주세요. 어려움이 새로 생기거나 오래 지속된다면 담임교사나 전문가와 상의할 수 있습니다. ${DIFFERENTIAL_GUIDANCE}`,
    color: getRiskLevelDisplay("low").resultColor
  },
  {
    min: 13, max: 26,
    level: "caution",
    title: getRiskLevelDisplay("caution").resultTitle,
    description: getRiskResultDescription("caution", "child"),
    recommendation: "어려움이 지속된다면 담임교사, Wee센터, 발달센터 등과 상담해 보세요. 가정에서는 반복 안내, 시각 단서, 칭찬 중심의 지원이 도움이 될 수 있습니다.",
    color: getRiskLevelDisplay("caution").resultColor
  },
  {
    min: 27, max: 54,
    level: "consult",
    title: getRiskLevelDisplay("consult").resultTitle,
    description: getRiskResultDescription("consult", "child"),
    recommendation: "가능하면 소아정신건강의학과, 임상심리사, 특수교육 전문가와 상의해 K-WISC 등 표준화 지능검사, Vineland·ABAS·NISE-K·ABS 등 적응행동검사, 면담을 포함한 평가를 받아보세요. 결과는 자녀에게 맞는 지원을 찾기 위한 참고 자료로 활용해 주세요.",
    color: getRiskLevelDisplay("consult").resultColor
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
    description: "경계선 지능 관련 교육·상담·지원 정보",
  },
  {
    name: "국가기초학력지원포털",
    url: "https://www.basics.re.kr",
    description: "기초학력 및 학습 지원 정보",
  },
  {
    name: "Wee센터",
    phone: "1588-7179",
    description: "학생 상담 및 심리검사 지원",
  },
  {
    name: "발달장애인지원센터",
    phone: "1644-8295",
    description: "발달·적응 관련 종합 지원",
  },
];
