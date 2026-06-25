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
  readonly nextAction: string;
  readonly memoPrompts: readonly string[];
  readonly limitNotice: string;
}

interface BuildInterpretationReportParams {
  readonly type: TestType;
  readonly score: number;
  readonly maxScore: number;
  readonly result: ResultLevel;
  readonly categoryScores: CategoryScores;
  readonly responseDate?: Date;
}

const REPORT_TITLE = "마음이음 자가체크 해석 리포트";

const GUIDE_TEXT =
  "이 리포트는 의학적 진단이 아니라, 응답 내용을 바탕으로 현재 경향을 이해하기 위한 참고 자료입니다.";

const LIMIT_NOTICE =
  "본 결과는 사용자의 응답을 바탕으로 한 참고용 자가체크 결과이며, 의학적 진단이나 장애 판정이 아닙니다. 정확한 판단이 필요한 경우 전문가 상담을 권장합니다.";

const MEMO_PROMPTS = [
  "최근 반복된 어려움",
  "도움이 필요하다고 느낀 상황",
  "상담 시 함께 전달할 내용",
] as const;

const CATEGORY_GUIDES: Readonly<Record<string, { readonly adult: string; readonly child: string; readonly checkPoint: string }>> = {
  "학습/개념 이해": {
    adult: "새로운 설명, 용어, 개념을 이해할 때 필요한 단서와 연습량을 살펴보는 영역입니다.",
    child: "아이가 새로운 개념이나 학습 내용을 익힐 때 어떤 단서가 도움이 되는지 살펴보는 영역입니다.",
    checkPoint: "반복 설명, 예시, 시각 자료가 있을 때 이해가 얼마나 수월해지는지 확인해 보세요.",
  },
  작업기억: {
    adult: "들은 내용을 잠시 기억하고 순서대로 처리하는 상황의 부담을 살펴보는 영역입니다.",
    child: "아이가 지시나 설명을 듣고 필요한 내용을 유지하는 모습을 살펴보는 영역입니다.",
    checkPoint: "두세 단계 지시, 방금 들은 내용, 해야 할 일을 다시 확인하는 빈도를 살펴보세요.",
  },
  처리속도: {
    adult: "읽고 이해하거나 새 절차를 따라가는 데 필요한 시간을 살펴보는 영역입니다.",
    child: "아이가 새 활동이나 규칙을 익히고 적용하는 속도를 살펴보는 영역입니다.",
    checkPoint: "시간 제한이 줄거나 시범이 있을 때 수행이 달라지는지 확인해 보세요.",
  },
  실행기능: {
    adult: "계획 세우기, 순서 유지, 시작과 마무리 같은 실행 과정을 살펴보는 영역입니다.",
    child: "아이가 과제와 준비물을 시작하고 마무리하는 과정에서 필요한 지원을 살펴보는 영역입니다.",
    checkPoint: "체크리스트, 알림, 작은 단계 나누기가 도움이 되는지 살펴보세요.",
  },
  "사회적 판단": {
    adult: "대화 표현이나 낯선 제안을 이해하고 판단하는 상황을 살펴보는 영역입니다.",
    child: "아이가 놀이, 대화, 상황 변화에서 규칙과 상대 반응을 읽는 모습을 살펴보는 영역입니다.",
    checkPoint: "구체적인 예시나 미리 알려 주기가 있을 때 대처가 수월해지는지 확인해 보세요.",
  },
  "정서/주의/수면 등 혼동 요인": {
    adult: "피로, 걱정, 수면, 스트레스가 집중과 판단에 미치는 영향을 함께 살펴보는 영역입니다.",
    child: "아이가 피로, 걱정, 수면, 산만한 환경에서 보이는 변화를 함께 살펴보는 영역입니다.",
    checkPoint: "컨디션이 좋은 날과 어려운 날의 차이를 간단히 기록해 보세요.",
  },
  "일상생활 적응": {
    adult: "새로운 절차, 장소, 행정 업무처럼 생활 속 적응 상황을 살펴보는 영역입니다.",
    child: "아이가 일상 루틴과 환경 변화에 적응하는 과정을 살펴보는 영역입니다.",
    checkPoint: "예고, 순서 안내, 함께 확인하기가 실제 생활에서 도움이 되는지 보세요.",
  },
  "학업/직업 적응": {
    adult: "업무, 서류, 신청 절차처럼 학업이나 직업 생활에서 필요한 처리 과정을 살펴보는 영역입니다.",
    child: "아이가 수업, 과제, 학교생활 절차에서 어떤 지원이 필요한지 살펴보는 영역입니다.",
    checkPoint: "실수나 누락이 반복되는 상황과 도움이 되었던 지원 방식을 함께 적어 보세요.",
  },
} as const;

export function buildInterpretationReport(params: BuildInterpretationReportParams): InterpretationReport {
  const level = normalizeRiskLevel(params.result.level);
  const categoryInsights = Object.entries(params.categoryScores)
    .map(([category, item]) => buildCategoryInsight(params.type, category, item))
    .sort((a, b) => b.percentage - a.percentage);

  return {
    title: REPORT_TITLE,
    typeLabel: params.type === "adult" ? "성인용" : "아동용",
    responseDate: formatReportDate(params.responseDate ?? new Date()),
    guideText: GUIDE_TEXT,
    scoreText: `총점 ${params.score}점 / ${params.maxScore}점`,
    stageLabel: getStageLabel(level),
    oneLineSummary: getOneLineSummary(level),
    responsePattern: getResponsePattern(params.type, categoryInsights),
    categoryInsights,
    nextAction: getNextAction(params.type, level),
    memoPrompts: MEMO_PROMPTS,
    limitNotice: LIMIT_NOTICE,
  };
}

function buildCategoryInsight(type: TestType, category: string, item: CategoryScore): CategoryInsight {
  const percentage = item.max > 0 ? Math.round((item.score / item.max) * 100) : 0;
  const trend = getTrendLevel(percentage);
  const guide = CATEGORY_GUIDES[category];
  const interpretation = guide
    ? guide[type]
    : type === "adult"
    ? "응답에서 나타난 생활 속 어려움의 경향을 살펴보는 영역입니다."
    : "보호자가 관찰한 행동 경향을 살펴보는 영역입니다.";

  return {
    category,
    score: item.score,
    max: item.max,
    percentage,
    trend,
    trendLabel: getTrendLabel(trend),
    interpretation: `${interpretation} ${getTrendSentence(type, trend)}`,
    checkPoint: guide?.checkPoint ?? "비슷한 상황이 반복되는지, 어떤 도움이 효과적이었는지 기록해 보세요.",
  };
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
  if (trend === "high") return "높게 나타남";
  if (trend === "middle") return "일부 나타남";
  return "낮게 나타남";
}

function getTrendSentence(type: TestType, trend: TrendLevel): string {
  if (trend === "high") {
    return type === "adult"
      ? "이 영역에서 상대적으로 높은 응답이 나타나 생활 속 반복 여부를 살펴볼 필요가 있습니다."
      : "이 영역에서 상대적으로 높은 응답이 나타나 관찰되는 상황을 조금 더 구체적으로 살펴볼 수 있습니다.";
  }
  if (trend === "middle") {
    return type === "adult"
      ? "일부 상황에서 부담이 나타날 수 있어 컨디션이나 환경의 영향을 함께 보는 것이 좋습니다."
      : "일부 상황에서 지원이 도움이 될 수 있어 가정과 학교에서 반복되는 장면을 확인해 보세요.";
  }
  return type === "adult"
    ? "현재 응답에서는 이 영역의 어려움 신호가 높게 나타나지 않았습니다."
    : "현재 응답에서는 이 영역의 어려움 신호가 높게 관찰되지는 않았습니다.";
}

function getStageLabel(level: RiskLevelKey): string {
  if (level === "low") return "낮음";
  if (level === "caution") return "주의";
  return "상담 권장";
}

function getOneLineSummary(level: RiskLevelKey): string {
  if (level === "low") return "현재 응답에서는 뚜렷한 어려움 신호가 높게 나타나지 않았습니다.";
  if (level === "caution") return "일부 영역에서 반복적인 어려움이 나타날 가능성이 있어 생활 속 관찰이 필요합니다.";
  return "여러 문항에서 어려움 신호가 나타나 관련 기관이나 전문가와의 상담을 고려해볼 수 있습니다.";
}

function getNextAction(type: TestType, level: RiskLevelKey): string {
  if (level === "low") {
    return type === "adult"
      ? "현재는 큰 우려 신호가 높게 나타나지 않았지만, 생활 변화가 느껴지면 다시 점검해볼 수 있습니다."
      : "현재는 큰 우려 신호가 높게 관찰되지는 않았지만, 변화가 보이면 보호자 관찰 기록과 함께 다시 점검해볼 수 있습니다.";
  }
  if (level === "caution") {
    return type === "adult"
      ? "비슷한 어려움이 반복되는지 기록해보고, 생활 환경에서 도움이 필요한 부분을 살펴보는 것이 좋습니다."
      : "비슷한 어려움이 반복되는지 기록해보고, 가정이나 학교에서 지원이 필요한 장면을 살펴보는 것이 좋습니다.";
  }
  return type === "adult"
    ? "결과만으로 단정하지 말고, 관련 상담기관이나 전문가와 함께 구체적인 상황을 확인해보는 것을 권장합니다."
    : "결과만으로 단정하지 말고, 담임교사나 관련 상담기관, 전문가와 함께 아이의 구체적인 상황을 확인해보는 것을 권장합니다.";
}

function getResponsePattern(type: TestType, insights: readonly CategoryInsight[]): string {
  const topInsight = insights[0];
  if (!topInsight) {
    return "응답 내용을 바탕으로 반복되는 경향을 확인하기에는 정보가 충분하지 않습니다.";
  }

  if (topInsight.trend === "low") {
    return type === "adult"
      ? "전반적으로 높은 응답이 두드러지지는 않았습니다. 다만 생활 변화가 있을 때 다시 살펴볼 수 있습니다."
      : "전반적으로 높은 응답이 두드러지지는 않았습니다. 다만 아이의 환경 변화가 있을 때 다시 살펴볼 수 있습니다.";
  }

  return type === "adult"
    ? `${topInsight.category} 영역에서 상대적으로 높은 응답이 나타났습니다. 단정하기보다 비슷한 상황이 반복되는지 살펴보는 것이 좋습니다.`
    : `${topInsight.category} 영역에서 상대적으로 높은 응답이 관찰되었습니다. 아이가 어떤 상황에서 더 많은 지원을 필요로 하는지 살펴보는 것이 좋습니다.`;
}

function formatReportDate(date: Date): string {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
