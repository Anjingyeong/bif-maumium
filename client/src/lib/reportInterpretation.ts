import type { ResultLevel } from "./questions";
import type { RiskLevelKey, TestType } from "./riskLevels";

export interface CategoryScore {
  readonly score: number;
  readonly max: number;
}

export type CategoryScores = Record<string, CategoryScore>;
export type TrendLevel = "low" | "middle" | "high";

export interface CategoryInsight {
  readonly category: string;
  readonly score: number;
  readonly max: number;
  readonly percentage: number;
  readonly trend: TrendLevel;
  readonly trendLabel: string;
  readonly interpretation: string;
  readonly checkPoint: string;
}

export interface SupportFocusArea {
  readonly category: string;
  readonly trendLabel: string;
  readonly checkPoint: string;
}

export interface SupportStrategyGroup {
  readonly category: string;
  readonly strategies: readonly string[];
}

export interface InterpretationReport {
  readonly title: string;
  readonly typeLabel: string;
  readonly responseDate: string;
  readonly guideText: string;
  readonly scoreText: string;
  readonly stageLabel: string;
  readonly oneLineSummary: string;
  readonly responsePattern: string;
  readonly categoryInsights: readonly CategoryInsight[];
  readonly supportFocusAreas: readonly SupportFocusArea[];
  readonly supportStrategies: readonly SupportStrategyGroup[];
  readonly consultationGuidance: string;
  readonly nextAction: string;
  readonly memoPrompts: readonly string[];
  readonly limitNotice: string;
  readonly resultNotice: string;
  readonly serviceValueText: string;
}

interface BuildInterpretationReportParams {
  readonly type: TestType;
  readonly score: number;
  readonly maxScore: number;
  readonly result: ResultLevel;
  readonly categoryScores: CategoryScores;
  readonly responseDate?: Date;
}

const REPORT_TITLE = "maumium 자가체크 결과";
const GUIDE_TEXT = "응답 내용을 바탕으로 현재 경향과 도움이 될 수 있는 방향을 함께 살펴봅니다.";
const RESULT_NOTICE =
  "이 결과는 진단이나 확정 판정이 아니라, 응답 내용을 바탕으로 현재 경향을 이해하기 위한 선별용 참고자료입니다.";
const SERVICE_VALUE_TEXT =
  "maumium은 단순히 결과를 보여주는 데서 끝나지 않고, 어려움이 나타날 수 있는 영역과 생활 속에서 시도해 볼 지원 방법을 함께 안내합니다.";
const CONSULTATION_GUIDANCE =
  "어려움이 3개월 이상 반복되거나 학교, 직장, 가정생활에 영향이 클 때는 전문기관 상담이나 평가를 고려해 볼 수 있어요.";
const LIMIT_NOTICE = `${RESULT_NOTICE} 결과가 걱정된다면 혼자 판단하지 말고 신뢰할 수 있는 사람이나 전문기관과 함께 확인해 주세요.`;
const MEMO_PROMPTS = [
  "최근 1~3개월 동안 반복된 어려움",
  "도움이 필요하다고 느낀 상황",
  "상담 때 함께 전달하고 싶은 내용",
] as const;

const LEVEL_COPY: Readonly<Record<RiskLevelKey, { readonly label: string; readonly summary: string; readonly action: string }>> = {
  low: {
    label: "현재 경향",
    summary: "현재는 두드러진 어려움이 적게 나타났어요",
    action: "지금의 생활 리듬과 강점을 유지하면서, 불편함이 반복되는 상황이 생기면 간단히 기록해 보세요.",
  },
  caution: {
    label: "관찰 필요",
    summary: "반복되는 어려움을 살펴볼 필요가 있어요",
    action: "비슷한 어려움이 반복되는 상황을 기록하고, 생활 속 지원 전략을 하나씩 시도해 보세요.",
  },
  consult: {
    label: "상담 고려",
    summary: "전문기관 상담이나 평가를 고려해 볼 수 있어요",
    action:
      "이 결과만으로 판단하지 말고, 일상에서 비슷한 어려움이 계속된다면 전문기관 상담이나 평가를 받아보는 것을 권장합니다.",
  },
} as const;

const CATEGORY_GUIDES: Readonly<
  Record<string, { readonly adult: string; readonly child: string; readonly checkPoint: string; readonly strategies: readonly string[] }>
> = {
  "학습/개념 이해": {
    adult: "새로운 개념이나 설명을 이해할 때 구체적인 예시와 반복 확인이 도움이 될 수 있는 영역입니다.",
    child: "새로운 개념을 배울 때 말 설명보다 쉬운 예시와 반복 안내가 도움이 될 수 있는 영역입니다.",
    checkPoint: "긴 설명을 짧게 나누고, 메모나 그림으로 다시 확인할 수 있는지 살펴보세요.",
    strategies: ["긴 설명은 짧게 나누기", "중요한 내용은 메모나 그림으로 남기기", "한 번에 한 가지씩 확인하기", "반복해서 확인할 수 있는 체크리스트 만들기"],
  },
  "작업기억": {
    adult: "들은 내용을 잠시 기억하고 순서대로 처리하는 과정에서 보조 단서가 도움이 될 수 있는 영역입니다.",
    child: "여러 지시를 한 번에 기억하기보다 작은 단위로 나누어 확인하는 도움이 필요할 수 있는 영역입니다.",
    checkPoint: "지시를 한 번에 많이 주기보다 한 단계씩 나누면 수행이 쉬워지는지 살펴보세요.",
    strategies: ["한 번에 하나씩 지시 나누기", "중요한 순서는 적어두기", "끝낸 일을 바로 표시하기", "질문을 작게 쪼개어 확인하기"],
  },
  "처리속도": {
    adult: "읽고 이해하거나 절차를 따라갈 때 충분한 시간이 있으면 더 안정적으로 해낼 수 있는 영역입니다.",
    child: "새 규칙이나 활동을 익힐 때 시범과 반복 연습이 도움이 될 수 있는 영역입니다.",
    checkPoint: "시간 압박을 줄였을 때 이해와 수행이 좋아지는지 확인해 보세요.",
    strategies: ["충분한 준비 시간 주기", "예시를 먼저 보고 따라 하기", "말 설명보다 그림이나 실제 시범 활용하기", "쉬는 시간을 정해 집중 부담 줄이기"],
  },
  "실행기능": {
    adult: "계획 세우기, 시작하기, 순서 지키기, 마무리하기에서 구조화가 도움이 될 수 있는 영역입니다.",
    child: "과제나 준비물을 시작하고 마무리하는 과정에서 구체적인 안내가 도움이 될 수 있는 영역입니다.",
    checkPoint: "해야 할 일을 작은 단계로 나누고 체크리스트를 쓰면 부담이 줄어드는지 살펴보세요.",
    strategies: ["해야 할 일을 작은 단계로 나누기", "우선순위 1~3개만 정하기", "알람, 캘린더, 체크리스트 사용하기", "시작 시간을 정해두기"],
  },
  "사회적 판단": {
    adult: "상대의 표현, 상황 변화, 권유나 제안을 이해할 때 함께 확인하는 절차가 도움이 될 수 있는 영역입니다.",
    child: "친구 관계나 규칙 변화 상황에서 구체적인 설명과 연습이 도움이 될 수 있는 영역입니다.",
    checkPoint: "헷갈리는 말이나 상황을 다시 물어보고 정리할 수 있는 안전한 사람이 있는지 확인해 보세요.",
    strategies: ["상대방의 표정, 말투, 상황을 함께 확인하기", "헷갈리는 말은 다시 물어보기", "대화 상황을 나중에 정리해보기", "믿을 수 있는 사람과 역할극처럼 연습하기"],
  },
  "일상생활 적응": {
    adult: "낯선 장소, 행정 절차, 약속과 준비물 관리에서 루틴과 확인표가 도움이 될 수 있는 영역입니다.",
    child: "등교 준비, 새 일정, 생활 루틴에서 미리 알려주기와 시각 단서가 도움이 될 수 있는 영역입니다.",
    checkPoint: "자주 하는 일을 같은 순서로 정리했을 때 실수가 줄어드는지 살펴보세요.",
    strategies: ["자주 하는 일을 루틴으로 만들기", "준비물, 약속, 돈 관리 체크리스트 만들기", "새로운 장소나 일정은 미리 확인하기", "실수했을 때 다시 시도할 수 있는 방법 정하기"],
  },
  "학업/직업 적응": {
    adult: "업무나 신청 절차처럼 여러 단계를 거치는 일에서 예시와 단계별 안내가 도움이 될 수 있는 영역입니다.",
    child: "숙제, 시험, 학교생활 절차에서 핵심 단서와 반복 안내가 도움이 될 수 있는 영역입니다.",
    checkPoint: "긴 과제나 절차를 짧은 시간 단위로 나눌 때 부담이 줄어드는지 확인해 보세요.",
    strategies: ["긴 과제는 짧은 시간 단위로 나누기", "예시를 먼저 보고 따라 하기", "핵심 단어에 표시하기", "쉬는 시간을 정해 집중 부담 줄이기"],
  },
  "정서/주의/수면 등 혼동 요인": {
    adult: "수면, 스트레스, 걱정, 주변 소음이 집중과 판단에 영향을 줄 수 있어 함께 살펴볼 영역입니다.",
    child: "피로, 수면, 감정, 주변 환경이 학습과 행동에 영향을 줄 수 있어 함께 관찰할 영역입니다.",
    checkPoint: "컨디션이 좋은 날과 어려움이 큰 날의 차이를 간단히 기록해 보세요.",
    strategies: ["어려움이 생긴 상황과 감정을 기록하기", "충분한 수면과 휴식 확인하기", "부담이 큰 상황은 도움 요청하기", "감정이 커질 때 잠깐 멈추고 정리하는 방법 사용하기"],
  },
} as const;

export function buildInterpretationReport(params: BuildInterpretationReportParams): InterpretationReport {
  const level = normalizeRiskLevel(params.result.level);
  const categoryInsights = Object.entries(params.categoryScores)
    .map(([category, item]) => buildCategoryInsight(params.type, category, item))
    .sort((a, b) => b.percentage - a.percentage);
  const focusAreas = categoryInsights.filter((item) => item.trend !== "low").slice(0, 3);

  return {
    title: REPORT_TITLE,
    typeLabel: params.type === "adult" ? "성인" : "아동",
    responseDate: formatReportDate(params.responseDate ?? new Date()),
    guideText: GUIDE_TEXT,
    scoreText: `응답 경향 참고값 ${params.score} / ${params.maxScore}`,
    stageLabel: LEVEL_COPY[level].label,
    oneLineSummary: LEVEL_COPY[level].summary,
    responsePattern: getResponsePattern(params.type, focusAreas),
    categoryInsights,
    supportFocusAreas: focusAreas.map(({ category, trendLabel, checkPoint }) => ({ category, trendLabel, checkPoint })),
    supportStrategies: buildSupportStrategies(focusAreas),
    consultationGuidance: CONSULTATION_GUIDANCE,
    nextAction: LEVEL_COPY[level].action,
    memoPrompts: MEMO_PROMPTS,
    limitNotice: LIMIT_NOTICE,
    resultNotice: RESULT_NOTICE,
    serviceValueText: SERVICE_VALUE_TEXT,
  };
}

function buildCategoryInsight(type: TestType, category: string, item: CategoryScore): CategoryInsight {
  const percentage = item.max > 0 ? Math.round((item.score / item.max) * 100) : 0;
  const trend = getTrendLevel(percentage);
  const guide = CATEGORY_GUIDES[category];
  const interpretation =
    guide?.[type] ?? "응답에서 반복되는 경향을 생활 장면과 함께 살펴볼 수 있는 영역입니다.";

  return {
    category,
    score: item.score,
    max: item.max,
    percentage,
    trend,
    trendLabel: getTrendLabel(trend),
    interpretation: `${interpretation} ${getTrendSentence(trend)}`,
    checkPoint: guide?.checkPoint ?? "비슷한 상황이 반복되는지, 어떤 지원이 효과적인지 기록해 보세요.",
  };
}

function buildSupportStrategies(focusAreas: readonly CategoryInsight[]): readonly SupportStrategyGroup[] {
  return focusAreas.map((area) => ({
    category: area.category,
    strategies: CATEGORY_GUIDES[area.category]?.strategies ?? [
      "어려움이 반복되는 상황을 간단히 기록하기",
      "해야 할 일을 작은 단계로 나누기",
      "믿을 수 있는 사람에게 확인 요청하기",
    ],
  }));
}

function normalizeRiskLevel(level: string): RiskLevelKey {
  if (level === "low" || level === "caution" || level === "consult") return level;
  return "caution";
}

function getTrendLevel(percentage: number): TrendLevel {
  if (percentage >= 67) return "high";
  if (percentage >= 34) return "middle";
  return "low";
}

function getTrendLabel(trend: TrendLevel): string {
  if (trend === "high") return "도움이 필요할 수 있어요";
  if (trend === "middle") return "살펴보면 좋아요";
  return "두드러지지 않아요";
}

function getTrendSentence(trend: TrendLevel): string {
  if (trend === "high") return "우선 지원 방향을 정해 작은 변화부터 시도해 보세요.";
  if (trend === "middle") return "상황과 컨디션에 따라 달라질 수 있어 생활 기록이 도움이 됩니다.";
  return "현재 응답에서는 두드러진 어려움이 크게 나타나지 않았습니다.";
}

function getResponsePattern(type: TestType, focusAreas: readonly CategoryInsight[]): string {
  const topArea = focusAreas[0];
  if (!topArea) {
    return type === "adult"
      ? "현재 응답에서는 특정 영역의 어려움이 두드러지지 않았습니다. 불편함이 반복되는 상황이 생기면 다시 살펴보세요."
      : "현재 응답에서는 특정 영역의 어려움이 두드러지지 않았습니다. 환경 변화가 있을 때 보호자 관찰 기록과 함께 다시 살펴보세요.";
  }

  return type === "adult"
    ? `${topArea.category} 영역에서 도움이 필요할 수 있는 응답이 나타났습니다. 점수보다 어떤 상황에서 반복되는지 살펴보는 것이 중요합니다.`
    : `${topArea.category} 영역에서 도움이 필요할 수 있는 응답이 관찰되었습니다. 아이가 어떤 상황에서 더 많은 안내를 필요로 하는지 살펴보세요.`;
}

function formatReportDate(date: Date): string {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
