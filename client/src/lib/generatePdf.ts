import jsPDF from "jspdf";
import {
  ResultLevel,
  QuestionSet,
  AnswerValue,
  getCategoryScores,
  supportResources,
} from "./questions";
import { shouldShowSupportResources } from "./riskLevels";
import { buildInterpretationReport } from "./reportInterpretation";
import { canvasText, rect, roundedRect } from "./pdfDrawing";
import { renderQuestionSummary } from "./pdfQuestionSummary";

export interface GeneratePdfParams {
  type: "adult" | "child";
  score: number;
  maxScore: number;
  result: ResultLevel;
  answers: Record<number, AnswerValue>;
  questionSet: QuestionSet;
}

export async function generateResultPdf(params: GeneratePdfParams): Promise<Blob> {
  const { type, score, maxScore, result, answers, questionSet } = params;
  const categoryScores = getCategoryScores(answers, questionSet.questions);
  const report = buildInterpretationReport({ type, score, maxScore, result, categoryScores });
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
  });

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const pageH = 297;
  const margin = 18;
  const contentW = pageW - margin * 2;

  if ("fonts" in document) {
    const fontLoadPromise = Promise.allSettled([
      document.fonts.ready,
      document.fonts.load('400 16px "Pretendard"', "한글"),
      document.fonts.load('700 16px "Pretendard"', "한글"),
      document.fonts.load('400 16px "Noto Sans KR"', "한글"),
      document.fonts.load('700 16px "Noto Sans KR"', "한글"),
      document.fonts.load('400 16px "Malgun Gothic"', "한글"),
      document.fonts.load('700 16px "Malgun Gothic"', "한글"),
    ]);
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 1500));
    await Promise.race([fontLoadPromise, timeoutPromise]);
  }

  rect(doc, 0, 0, pageW, 48, "#2f7d5c");

  canvasText(doc, "마음이음", margin, 16, { size: 18, bold: true, color: "#ffffff" });
  canvasText(doc, report.title, margin, 28, { size: 10, color: "#d9eee3" });
  canvasText(doc, report.typeLabel, pageW - margin, 16, { size: 10, bold: true, color: "#d9eee3", align: "right" });
  canvasText(doc, `응답일 ${report.responseDate}`, pageW - margin, 28, { size: 9, color: "#d9eee3", align: "right" });

  rect(doc, 0, 48, pageW, 10, "#fff8e8");
  canvasText(doc, report.guideText, pageW / 2, 55, {
    size: 8, color: "#9a7020", align: "center",
  });

  let y = 70;

  canvasText(doc, `현재 경향 · ${report.stageLabel}`, margin, y, { size: 15, bold: true, color: "#2f7d5c" });
  canvasText(doc, `${report.scoreText} · 응답 경향 참고값`, margin, y + 9, { size: 8.5, color: "#666666" });

  const summaryText = `${report.oneLineSummary} ${report.responsePattern}`;
  const descHeight = canvasText(doc, summaryText, margin + 5, y + 22, {
    size: 8.5, color: "#374151", maxWidth: contentW - 10, measureOnly: true
  });
  const descBoxH = Math.max(22, descHeight + 10);

  roundedRect(doc, margin, y + 15, contentW, descBoxH, 3, "#edf7f1");
  doc.setDrawColor(180, 190, 220);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y + 15, contentW, descBoxH, 3, 3, "S");
  canvasText(doc, summaryText, margin + 5, y + 20, {
    size: 8.5, color: "#374151", maxWidth: contentW - 10,
  });

  y += 15 + descBoxH + 10;

  canvasText(doc, "도움이 필요할 수 있는 영역", margin, y, { size: 12, bold: true, color: "#2f7d5c" });
  y += 8;

  const focusAreas = report.supportFocusAreas.length > 0
    ? report.supportFocusAreas
    : [{ category: "현재 경향", trendLabel: "두드러지지 않아요", checkPoint: "불편함이 반복되는 상황이 생기면 언제, 어디서, 어떤 도움이 필요했는지 기록해 보세요." }];

  focusAreas.forEach((item) => {
    const checkHeight = canvasText(doc, `확인 포인트: ${item.checkPoint}`, margin + 5, y + 17, {
      size: 7.8, color: "#666666", maxWidth: contentW - 10, measureOnly: true
    });
    const cardH = Math.max(28, 22 + checkHeight);

    if (y + cardH > pageH - 22) {
      doc.addPage();
      y = margin;
    }

    roundedRect(doc, margin, y, contentW, cardH, 3, "#f7fbf8");
    doc.setDrawColor(220, 225, 235);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentW, cardH, 3, 3, "S");

    canvasText(doc, item.category, margin + 5, y + 6, { size: 8.5, bold: true, color: "#2f7d5c" });
    canvasText(doc, item.trendLabel, margin + contentW - 5, y + 6, {
      size: 7.5, color: "#666666", align: "right"
    });
    canvasText(doc, "문제 영역이 아니라, 도움 방향을 살펴볼 영역입니다.", margin + 5, y + 12, {
      size: 7.6, color: "#374151", maxWidth: contentW - 10,
    });
    canvasText(doc, `확인 포인트: ${item.checkPoint}`, margin + 5, y + 18, {
      size: 7.8, color: "#666666", maxWidth: contentW - 10,
    });

    y += cardH + 4;
  });

  y += 4;

  if (report.supportStrategies.length > 0) {
    canvasText(doc, "생활 속 지원 전략", margin, y, { size: 12, bold: true, color: "#2f7d5c" });
    y += 8;

    report.supportStrategies.forEach((group) => {
      const strategyText = group.strategies.map((strategy) => `- ${strategy}`).join("\n");
      const strategyHeight = canvasText(doc, strategyText, margin + 5, y + 13, {
        size: 7.8, color: "#374151", maxWidth: contentW - 10, measureOnly: true
      });
      const cardH = Math.max(26, strategyHeight + 18);

      if (y + cardH > pageH - 22) {
        doc.addPage();
        y = margin;
      }

      roundedRect(doc, margin, y, contentW, cardH, 3, "#edf7f1");
      doc.setDrawColor(180, 190, 220);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentW, cardH, 3, 3, "S");
      canvasText(doc, group.category, margin + 5, y + 6, { size: 8.5, bold: true, color: "#2f7d5c" });
      canvasText(doc, strategyText, margin + 5, y + 13, { size: 7.8, color: "#374151", maxWidth: contentW - 10 });

      y += cardH + 4;
    });

    y += 4;
  }

  const consultationHeight = canvasText(doc, report.consultationGuidance, margin + 5, y + 8, {
    size: 8.5, color: "#374151", maxWidth: contentW - 10, measureOnly: true
  });
  const consultationBoxH = Math.max(22, consultationHeight + 10);

  if (y + consultationBoxH + 10 > pageH - 22) {
    doc.addPage();
    y = margin;
  }

  canvasText(doc, "전문기관 상담을 고려할 때", margin, y, { size: 12, bold: true, color: "#2f7d5c" });
  y += 6;
  roundedRect(doc, margin, y, contentW, consultationBoxH, 3, "#f7fbf8");
  doc.setDrawColor(220, 225, 235);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentW, consultationBoxH, 3, 3, "S");
  canvasText(doc, report.consultationGuidance, margin + 5, y + 5, {
    size: 8.5, color: "#374151", maxWidth: contentW - 10,
  });
  y += consultationBoxH + 10;

  const recHeight = canvasText(doc, report.nextAction, margin + 5, y + 8, {
    size: 8.5, color: "#374151", maxWidth: contentW - 10, measureOnly: true
  });
  const recBoxH = Math.max(26, recHeight + 10);

  if (y + recBoxH + 10 > pageH - 22) {
    doc.addPage();
    y = margin;
  }

  canvasText(doc, "다음 행동 안내", margin, y, { size: 12, bold: true, color: "#2f7d5c" });
  y += 6;

  roundedRect(doc, margin, y, contentW, recBoxH, 3, "#edf7f1");
  doc.setDrawColor(180, 190, 220);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentW, recBoxH, 3, 3, "S");
  canvasText(doc, report.nextAction, margin + 5, y + 5, {
    size: 8.5, color: "#374151", maxWidth: contentW - 10,
  });

  y += recBoxH + 12;

  if (y + 44 > pageH - 22) {
    doc.addPage();
    y = margin;
  }
  canvasText(doc, type === "adult" ? "본인 확인 메모" : "보호자 확인 메모", margin, y, {
    size: 12, bold: true, color: "#2f7d5c"
  });
  y += 7;

  report.memoPrompts.forEach((prompt) => {
    roundedRect(doc, margin, y, contentW, 13, 2, "#ffffff");
    doc.setDrawColor(220, 225, 235);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentW, 13, 2, 2, "S");
    canvasText(doc, `${prompt}:`, margin + 5, y + 6, { size: 8, color: "#666666" });
    doc.setDrawColor(210, 215, 225);
    doc.line(margin + 48, y + 8, margin + contentW - 5, y + 8);
    y += 16;
  });

  if (shouldShowSupportResources(result.level)) {
    if (y + 40 > pageH - 22) {
      doc.addPage();
      y = margin;
    }
    canvasText(doc, "도움받을 수 있는 곳", margin, y, { size: 12, bold: true, color: "#2f7d5c" });
    y += 7;

    supportResources.forEach((resource, i) => {
      const resTextHeight = canvasText(doc, resource.description, margin + 5, y + 5, {
        size: 8, color: "#333333", maxWidth: contentW - 10, measureOnly: true
      });
      const resBoxH = resTextHeight + 16;

      if (y + resBoxH > pageH - 22) {
        doc.addPage();
        y = margin;
      }

      roundedRect(doc, margin, y, contentW, resBoxH, 2, "#f8f9fa");
      doc.setDrawColor(220, 225, 235);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentW, resBoxH, 2, 2, "S");

      canvasText(doc, resource.name, margin + 5, y + 5, { size: 9, bold: true, color: "#2f7d5c" });
      canvasText(doc, resource.description, margin + 5, y + 10, { size: 8, color: "#666666", maxWidth: contentW - 10 });

      y += resBoxH + 4;
    });

    y += 8;
  }

  const limitHeight = canvasText(doc, report.limitNotice, margin + 5, y + 8, {
    size: 8, color: "#66552a", maxWidth: contentW - 10, measureOnly: true
  });
  if (y + limitHeight + 18 > pageH - 22) {
    doc.addPage();
    y = margin;
  }
  canvasText(doc, "안내 및 한계", margin, y, { size: 12, bold: true, color: "#2f7d5c" });
  y += 6;
  roundedRect(doc, margin, y, contentW, Math.max(22, limitHeight + 10), 3, "#fff8e8");
  canvasText(doc, report.limitNotice, margin + 5, y + 5, {
    size: 8, color: "#66552a", maxWidth: contentW - 10,
  });
  y += Math.max(22, limitHeight + 10) + 10;

  if (y + 20 > pageH - 22) {
    doc.addPage();
    y = margin;
  }

  y = renderQuestionSummary(doc, { questionSet, answers, margin, contentW, pageH, y });

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    rect(doc, 0, pageH - 12, pageW, 12, "#2f7d5c");
    canvasText(doc, `마음이음 경계선 지능 선별검사  |  ${today}  |  ${p} / ${totalPages}`, pageW / 2, pageH - 5, {
      size: 7, color: "#d9eee3", align: "center",
    });
    canvasText(doc, "본 결과는 의학적 진단을 대체하지 않습니다.", pageW / 2, pageH - 9.5, {
      size: 6.5, color: "#9aa8a0", align: "center",
    });
  }

  return doc.output("blob");
}
