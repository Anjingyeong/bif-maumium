import type { jsPDF } from "jspdf";
import type { AnswerValue, QuestionSet } from "./questions";
import { answerOptions } from "./questions";
import { canvasText, rect } from "./pdfDrawing";

interface RenderQuestionSummaryParams {
  readonly questionSet: QuestionSet;
  readonly answers: Record<number, AnswerValue>;
  readonly margin: number;
  readonly contentW: number;
  readonly pageH: number;
  readonly y: number;
}

const ANSWER_COLORS: Readonly<Record<number, string>> = {
  0: "#888888",
  1: "#64748b",
  2: "#d97706",
  3: "#dc2626",
};

export function renderQuestionSummary(doc: jsPDF, params: RenderQuestionSummaryParams): number {
  const { questionSet, answers, margin, contentW, pageH } = params;
  let y = params.y;

  canvasText(doc, "문항별 응답 요약", margin, y, { size: 12, bold: true, color: "#2f7d5c" });
  y += 7;

  rect(doc, margin, y - 3, contentW, 7, "#2f7d5c");
  canvasText(doc, "번호", margin + 3, y + 1, { size: 8, bold: true, color: "#ffffff" });
  canvasText(doc, "문항", margin + 18, y + 1, { size: 8, bold: true, color: "#ffffff" });
  canvasText(doc, "응답", margin + contentW - 3, y + 1, { size: 8, bold: true, color: "#ffffff", align: "right" });
  y += 8;

  questionSet.questions.forEach((question, index) => {
    const questionHeight = canvasText(doc, question.text, margin + 18, y + 1, {
      size: 8,
      maxWidth: contentW - 40,
      measureOnly: true,
    });
    const rowH = Math.max(7, questionHeight + 3);

    if (y + rowH > pageH - 22) {
      doc.addPage();
      y = margin;
    }

    rect(doc, margin, y - 3, contentW, rowH, index % 2 === 0 ? "#f7fbf8" : "#ffffff");
    canvasText(doc, `${question.id}`, margin + 3, y + 1, { size: 8, color: "#666666" });
    canvasText(doc, question.text, margin + 18, y + 1, { size: 8, color: "#333333", maxWidth: contentW - 40 });

    const answer = answers[question.id];
    const answerLabel = answer !== undefined ? answerOptions.find((option) => option.value === answer)?.label ?? "-" : "-";
    const answerColor = answer !== undefined ? ANSWER_COLORS[answer] ?? "#888888" : "#888888";
    canvasText(doc, answerLabel, margin + contentW - 3, y + 1, { size: 8, color: answerColor, align: "right" });

    y += rowH;
  });

  return y;
}
