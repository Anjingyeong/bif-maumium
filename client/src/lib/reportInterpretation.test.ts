import { describe, expect, it } from "vitest";
import { buildInterpretationReport } from "./reportInterpretation";
import type { ResultLevel } from "./questions";

const cautionResult: ResultLevel = {
  min: 11,
  max: 22,
  level: "caution",
  title: "반복되는 어려움을 살펴볼 필요가 있어요",
  description: "여러 상황에서 어려움이 반복될 가능성이 있습니다.",
  recommendation: "생활 속 지원 전략을 확인해 보세요.",
  color: "#d97706",
};

describe("buildInterpretationReport", () => {
  it("builds support-centered guidance when category scores show a high support area", () => {
    const report = buildInterpretationReport({
      type: "adult",
      score: 18,
      maxScore: 45,
      result: cautionResult,
      categoryScores: {
        "실행기능": { score: 8, max: 9 },
        "작업기억": { score: 2, max: 6 },
      },
      responseDate: new Date("2026-06-29T00:00:00.000Z"),
    });

    expect(report.scoreText).toContain("응답 경향 참고값");
    expect(report.oneLineSummary).toBe("반복되는 어려움을 살펴볼 필요가 있어요");
    expect(report.supportFocusAreas.map((area) => area.category)).toEqual(["실행기능"]);
    expect(report.supportStrategies[0]?.strategies).toContain("해야 할 일을 작은 단계로 나누기");
    expect(report.consultationGuidance).toContain("3개월 이상 반복");
    expect(report.resultNotice).toContain("진단이나 확정 판정이 아니라");
    expect(report.serviceValueText).toContain("생활 속에서 시도해 볼 지원 방법");
  });

  it("keeps diagnostic and stigma terms out of user-facing guidance", () => {
    const report = buildInterpretationReport({
      type: "child",
      score: 30,
      maxScore: 54,
      result: { ...cautionResult, level: "consult" },
      categoryScores: {
        "학습/개념 이해": { score: 7, max: 9 },
      },
      responseDate: new Date("2026-06-29T00:00:00.000Z"),
    });

    const visibleCopy = [
      report.guideText,
      report.oneLineSummary,
      report.responsePattern,
      report.nextAction,
      report.resultNotice,
      ...report.supportStrategies.flatMap((item) => [item.category, ...item.strategies]),
    ].join(" ");

    expect(visibleCopy).not.toMatch(/장애 판정|IQ 판정|정상\/비정상|고위험|심각|완치|치료 보장/);
  });
});
