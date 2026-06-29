export type TestType = "adult" | "child";
export type RiskLevelKey = "low" | "caution" | "consult";

export const SCREENING_DISCLAIMER =
  "이 결과는 표준화 검사나 진단을 대체하지 않는 선별용 참고자료입니다. 주의력, 정서, 학습 문제, 수면, 스트레스, 학습 환경 등 다른 요인도 함께 영향을 줄 수 있습니다.";
export const DIFFERENTIAL_GUIDANCE =
  "결과는 현재 상태를 살펴보는 참고자료로만 사용해 주세요. 어려움이 반복되거나 일상생활에 영향이 크다면 전문기관 상담이나 평가를 함께 고려해 볼 수 있습니다.";

interface RiskLevelDisplay {
  readonly label: string;
  readonly badgeLabel: string;
  readonly resultTitle: string;
  readonly descriptions: Readonly<Record<TestType, string>>;
  readonly pdfColor: string;
  readonly badgeColor: string;
  readonly chartColor: string;
  readonly resultColor: string;
  readonly showSupportResources: boolean;
}

interface LegacyRiskLevelDisplay {
  readonly badgeLabel: string;
  readonly pdfColor: string;
  readonly badgeColor: string;
}

const RISK_LEVELS: Readonly<Record<RiskLevelKey, RiskLevelDisplay>> = {
  low: {
    label: "현재 경향",
    badgeLabel: "현재 경향",
    resultTitle: "현재는 두드러진 어려움이 적게 나타났어요",
    descriptions: {
      adult: `응답 내용에서는 현재 두드러진 어려움이 크게 나타나지 않았습니다. 생활 변화나 불편함이 반복되는 상황이 생기면 다시 살펴보세요. ${SCREENING_DISCLAIMER}`,
      child: `보호자 응답에서는 현재 두드러진 어려움이 크게 관찰되지 않았습니다. 환경 변화가 있을 때 아이의 생활 장면을 함께 기록해 보세요. ${SCREENING_DISCLAIMER}`,
    },
    pdfColor: "#64748b",
    badgeColor: "#64748b",
    chartColor: "#64748b",
    resultColor: "#64748b",
    showSupportResources: false,
  },
  caution: {
    label: "관찰 필요",
    badgeLabel: "관찰 필요",
    resultTitle: "반복되는 어려움을 살펴볼 필요가 있어요",
    descriptions: {
      adult: `일부 영역에서 도움이 필요할 수 있는 응답이 나타났습니다. 비슷한 어려움이 반복되는 상황을 기록하고 생활 속 지원 전략을 하나씩 시도해 보세요. ${SCREENING_DISCLAIMER}`,
      child: `보호자 응답에서 일부 영역의 지원 필요성이 관찰되었습니다. 어떤 상황에서 아이가 더 많은 안내를 필요로 하는지 기록해 보세요. ${SCREENING_DISCLAIMER}`,
    },
    pdfColor: "#d97706",
    badgeColor: "#d97706",
    chartColor: "#d97706",
    resultColor: "#d97706",
    showSupportResources: false,
  },
  consult: {
    label: "상담 고려",
    badgeLabel: "상담 고려",
    resultTitle: "전문기관 상담이나 평가를 고려해 볼 수 있어요",
    descriptions: {
      adult: `여러 영역에서 도움이 필요할 수 있는 응답이 나타났습니다. 결과만으로 판단하지 말고, 일상에서 어려움이 반복된다면 전문기관 상담이나 평가를 함께 고려해 보세요. ${SCREENING_DISCLAIMER}`,
      child: `보호자 응답에서 여러 영역의 지원 필요성이 관찰되었습니다. 아이가 일상에서 겪는 상황을 정리해 전문기관 상담이나 평가 때 함께 확인해 보세요. ${SCREENING_DISCLAIMER}`,
    },
    pdfColor: "#2f7d5c",
    badgeColor: "#2f7d5c",
    chartColor: "#2f7d5c",
    resultColor: "#2f7d5c",
    showSupportResources: true,
  },
} as const;

const LEGACY_RISK_LEVELS: Readonly<Record<string, LegacyRiskLevelDisplay>> = {
  normal: { badgeLabel: "현재 경향", pdfColor: "#64748b", badgeColor: "#64748b" },
  mild: { badgeLabel: "관찰 필요", pdfColor: "#d97706", badgeColor: "#d97706" },
  moderate: { badgeLabel: "상담 고려", pdfColor: "#2f7d5c", badgeColor: "#2f7d5c" },
  high: { badgeLabel: "상담 고려", pdfColor: "#2f7d5c", badgeColor: "#2f7d5c" },
} as const;

const UNKNOWN_RISK_LEVEL: LegacyRiskLevelDisplay = {
  badgeLabel: "확인 필요",
  pdfColor: "#64748b",
  badgeColor: "#94a3b8",
};

const LEGACY_RISK_STAT_BUCKETS: Readonly<Record<string, RiskLevelKey>> = {
  normal: "low",
  mild: "caution",
  moderate: "consult",
  high: "consult",
} as const;

function isRiskLevelKey(level: string): level is RiskLevelKey {
  return level === "low" || level === "caution" || level === "consult";
}

export function getRiskLevelDisplay(level: RiskLevelKey): RiskLevelDisplay {
  return RISK_LEVELS[level];
}

export function getRiskResultDescription(level: RiskLevelKey, type: TestType): string {
  return RISK_LEVELS[level].descriptions[type];
}

export function getRiskPdfColor(level: string): string {
  if (isRiskLevelKey(level)) return RISK_LEVELS[level].pdfColor;
  return LEGACY_RISK_LEVELS[level]?.pdfColor ?? UNKNOWN_RISK_LEVEL.pdfColor;
}

export function getRiskBadgeColor(level: string): string {
  if (isRiskLevelKey(level)) return RISK_LEVELS[level].badgeColor;
  return LEGACY_RISK_LEVELS[level]?.badgeColor ?? UNKNOWN_RISK_LEVEL.badgeColor;
}

export function getRiskBadgeLabel(level: string): string {
  if (isRiskLevelKey(level)) return RISK_LEVELS[level].badgeLabel;
  return LEGACY_RISK_LEVELS[level]?.badgeLabel ?? (level || UNKNOWN_RISK_LEVEL.badgeLabel);
}

export function shouldShowSupportResources(level: string): boolean {
  return isRiskLevelKey(level) ? RISK_LEVELS[level].showSupportResources : false;
}

export function getRiskStatsBucket(level: string | null | undefined): RiskLevelKey | null {
  if (!level) return null;
  if (isRiskLevelKey(level)) return level;
  return LEGACY_RISK_STAT_BUCKETS[level] ?? null;
}
