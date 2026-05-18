import { describe, expect, it } from "vitest";
import {
  adultQuestions,
  childQuestions,
  getCategoryScores,
  getResultLevel,
  type AnswerValue,
} from "@/lib/questions";

const expectedDomains = [
  "학습/개념 이해",
  "작업기억",
  "처리속도",
  "실행기능",
  "사회적 판단",
  "일상생활 적응",
  "학업/직업 적응",
  "정서/주의/수면 등 혼동 요인",
];

const prohibitedQuestionPhrases = [
  "머리가 나쁘",
  "경계선 지능인 것 같다",
  "진단받",
  "확정",
  "장애 판정",
  "부족합니다",
  "미숙합니다",
  "못합니다",
];

describe("screening question sets", () => {
  it("keeps the existing adult and child question counts", () => {
    expect(adultQuestions.questions).toHaveLength(15);
    expect(childQuestions.questions).toHaveLength(18);
  });

  it("uses balanced screening domains for both tests", () => {
    const adultDomains = new Set(adultQuestions.questions.map((q) => q.category));
    const childDomains = new Set(childQuestions.questions.map((q) => q.category));

    for (const domain of expectedDomains) {
      expect(adultDomains.has(domain), `adult missing ${domain}`).toBe(true);
      expect(childDomains.has(domain), `child missing ${domain}`).toBe(true);
    }
  });

  it("uses non-stigmatizing behavioral wording", () => {
    const questionTexts = [...adultQuestions.questions, ...childQuestions.questions].map((q) => q.text);

    for (const text of questionTexts) {
      for (const phrase of prohibitedQuestionPhrases) {
        expect(text.includes(phrase), `${text} should not include ${phrase}`).toBe(false);
      }
    }
  });

  it("frames results as screening guidance rather than diagnosis", () => {
    const adultHigh = getResultLevel(45, "adult");
    const childHigh = getResultLevel(54, "child");

    expect(adultHigh.description).toContain("표준화 검사");
    expect(childHigh.description).toContain("표준화 검사");
    expect(adultHigh.description).toContain("주의력, 정서, 학습 문제");
    expect(childHigh.description).toContain("주의력, 정서, 학습 문제");
    expect(adultHigh.description).not.toContain("확정");
    expect(childHigh.description).not.toContain("확정");
  });

  it("calculates category scores without changing the total-score structure", () => {
    const answers: Record<number, AnswerValue> = {
      1: 3,
      2: 2,
      3: 1,
      4: 0,
    };
    const scores = getCategoryScores(answers, adultQuestions.questions);
    const totalScore = Object.values(scores).reduce((sum, item) => sum + item.score, 0);
    const totalMax = Object.values(scores).reduce((sum, item) => sum + item.max, 0);

    expect(totalScore).toBe(6);
    expect(totalMax).toBe(45);
  });
});
