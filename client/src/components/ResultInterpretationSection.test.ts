import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { ResultInterpretationSection } from "./ResultInterpretationSection";
import type { InterpretationReport } from "@/lib/reportInterpretation";

const report: InterpretationReport = {
  title: "maumium 자가체크 결과",
  typeLabel: "성인",
  responseDate: "2026년 6월 29일",
  guideText: "응답 내용을 바탕으로 현재 경향을 이해하기 위한 참고자료입니다.",
  scoreText: "응답 경향 참고값 18 / 45",
  stageLabel: "관찰 필요",
  oneLineSummary: "반복되는 어려움을 살펴볼 필요가 있어요",
  responsePattern: "실행기능 영역에서 도움이 필요할 수 있는 응답이 나타났습니다.",
  categoryInsights: [],
  supportFocusAreas: [
    {
      category: "실행기능",
      trendLabel: "도움이 필요할 수 있어요",
      checkPoint: "과제를 작은 단계로 나누면 도움이 되는지 살펴보세요.",
    },
  ],
  supportStrategies: [
    {
      category: "실행기능",
      strategies: ["해야 할 일을 작은 단계로 나누기", "체크리스트 사용하기"],
    },
  ],
  consultationGuidance: "어려움이 3개월 이상 반복될 때 전문기관 상담을 고려해 볼 수 있어요.",
  nextAction: "생활 속 지원 전략을 하나씩 시도해 보세요.",
  memoPrompts: [],
  limitNotice: "선별용 참고자료입니다.",
  resultNotice: "이 결과는 진단이나 확정 판정이 아닙니다.",
  serviceValueText: "maumium은 생활 속에서 시도해 볼 지원 방법을 함께 안내합니다.",
};

describe("ResultInterpretationSection", () => {
  beforeAll(() => {
    vi.stubGlobal("React", React);
  });

  it("renders support guidance instead of score-centered summary tiles", () => {
    const html = renderToStaticMarkup(
      React.createElement(ResultInterpretationSection, {
        report,
        accentColor: "#2F7D5C",
      })
    );

    expect(html).toContain("도움이 필요할 수 있는 영역");
    expect(html).toContain("생활 속에서 시도해 볼 방법");
    expect(html).toContain("전문기관 상담을 고려할 때");
    expect(html).toContain("해야 할 일을 작은 단계로 나누기");
    expect(html).not.toContain("총점");
  });
});
