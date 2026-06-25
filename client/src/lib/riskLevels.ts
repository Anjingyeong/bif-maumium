export type TestType = "adult" | "child";
export type RiskLevelKey = "low" | "caution" | "consult";

export const SCREENING_DISCLAIMER = "본 결과는 진단이 아닌 참고용 선별 결과입니다. 정확한 평가는 임상심리사, 정신건강의학과, 특수교육 전문가 등이 실시하는 표준화 지능검사와 적응행동검사, 면담을 통해 이루어져야 합니다. 본 결과만으로 경계선 지능 여부를 확정하지 않습니다.";
export const DIFFERENTIAL_GUIDANCE = "주의력 문제, 우울·불안, 수면부족, 스트레스, 학습장애, 환경 변화 등도 응답에 영향을 줄 수 있으므로 결과는 현재 상태를 살펴보는 참고 자료로만 활용해 주세요.";

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
    label: "낮음",
    badgeLabel: "낮음",
    resultTitle: "낮음 — 현재 응답상 어려움 가능성 낮음",
    descriptions: {
      adult: `총점이 낮음 단계에 해당합니다. 현재 응답만으로는 학습·인지·적응기능 어려움 가능성이 낮아 보입니다. ${SCREENING_DISCLAIMER}`,
      child: `보호자 해석: 총점이 낮음 단계에 해당합니다. 현재 응답만으로는 자녀의 학습·인지·적응기능 어려움 가능성이 낮아 보입니다. ${SCREENING_DISCLAIMER}`,
    },
    pdfColor: "#4caf82",
    badgeColor: "#22c55e",
    chartColor: "#22c55e",
    resultColor: "oklch(0.65 0.15 145)",
    showSupportResources: false,
  },
  caution: {
    label: "주의",
    badgeLabel: "주의",
    resultTitle: "주의 — 일부 영역 점검 필요",
    descriptions: {
      adult: `총점이 주의 단계에 해당합니다. 일부 영역에서 어려움이 나타나며, 피로·스트레스·수면·주의력·정서 상태에 따라 일시적으로 높게 나타날 수도 있습니다. ${SCREENING_DISCLAIMER}`,
      child: `보호자 해석: 총점이 주의 단계에 해당합니다. 일부 영역에서 어려움이 나타나며 수면, 정서, 주의집중, 학습 환경, 과제 난이도에 따라 응답이 높아질 수 있습니다. ${SCREENING_DISCLAIMER}`,
    },
    pdfColor: "#d4a017",
    badgeColor: "#eab308",
    chartColor: "#eab308",
    resultColor: "oklch(0.7 0.12 85)",
    showSupportResources: false,
  },
  consult: {
    label: "상담 권장",
    badgeLabel: "상담 권장",
    resultTitle: "상담 권장 — 전문 상담 또는 평가 고려",
    descriptions: {
      adult: `총점이 상담 권장 단계에 해당합니다. 여러 영역에서 어려움이 관찰되어 현재 기능 수준을 더 자세히 살펴볼 필요가 있습니다. ${SCREENING_DISCLAIMER}`,
      child: `보호자 해석: 총점이 상담 권장 단계에 해당합니다. 여러 영역에서 어려움이 관찰되어 자녀의 학습·인지·적응기능을 더 자세히 살펴볼 필요가 있습니다. ${SCREENING_DISCLAIMER}`,
    },
    pdfColor: "#c83232",
    badgeColor: "#ef4444",
    chartColor: "#ef4444",
    resultColor: "oklch(0.55 0.2 25)",
    showSupportResources: true,
  },
} as const;

const LEGACY_RISK_LEVELS: Readonly<Record<string, LegacyRiskLevelDisplay>> = {
  normal: { badgeLabel: "일상생활 잘 유지 중", pdfColor: "#4caf82", badgeColor: "#22c55e" },
  mild: { badgeLabel: "가벼운 어려움 있음", pdfColor: "#d4a017", badgeColor: "#eab308" },
  moderate: { badgeLabel: "전문가 상담 권장", pdfColor: "#e07030", badgeColor: "#f97316" },
  high: { badgeLabel: "전문가 상담 적극 권장", pdfColor: "#c83232", badgeColor: "#ef4444" },
} as const;

const UNKNOWN_RISK_LEVEL: LegacyRiskLevelDisplay = {
  badgeLabel: "알 수 없음",
  pdfColor: "#5070c8",
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
