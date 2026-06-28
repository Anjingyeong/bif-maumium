import jsPDF from "jspdf";
import {
  ResultLevel,
  QuestionSet,
  AnswerValue,
  getCategoryScores,
  answerOptions,
  supportResources,
} from "./questions";
import { getRiskPdfColor, shouldShowSupportResources } from "./riskLevels";
import { buildInterpretationReport } from "./reportInterpretation";
import { canvasText, hexToRgb, rect, roundedRect } from "./pdfDrawing";

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
  const percentage = Math.round((score / maxScore) * 100);
  const categoryScores = getCategoryScores(answers, questionSet.questions);
  const report = buildInterpretationReport({ type, score, maxScore, result, categoryScores });
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
  });

  const accentColor = getRiskPdfColor(result.level);

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

  const cx = margin + 24;
  const cy = y + 18;
  const r = 18;

  doc.setFillColor(230, 235, 245);
  doc.circle(cx, cy, r, "F");

  const [ar, ag, ab] = hexToRgb(accentColor);
  doc.setFillColor(ar, ag, ab);
  doc.circle(cx, cy, r, "F");

  doc.setFillColor(255, 255, 255);
  doc.circle(cx, cy, r * 0.72, "F");

  canvasText(doc, `${score}`, cx, cy - 1, { size: 13, bold: true, color: "#2f7d5c", align: "center" });
  canvasText(doc, `/ ${maxScore}`, cx, cy + 6, { size: 8, color: "#888888", align: "center" });

  const rx = margin + 52;
  canvasText(doc, `종합 결과 요약 · ${report.stageLabel}`, rx, y + 8, { size: 15, bold: true, color: "#2f7d5c" });
  canvasText(doc, `${report.scoreText} (${percentage}%)`, rx, y + 18, { size: 9, color: "#666666" });

  const summaryText = `${report.oneLineSummary} ${report.responsePattern}`;
  const descHeight = canvasText(doc, summaryText, rx + 4, y + 30, {
    size: 8.5, color: "#374151", maxWidth: contentW - 62, measureOnly: true
  });
  const descBoxH = Math.max(22, descHeight + 10);

  roundedRect(doc, rx, y + 22, contentW - 54, descBoxH, 3, "#edf7f1");
  doc.setDrawColor(180, 190, 220);
  doc.setLineWidth(0.4);
  doc.roundedRect(rx, y + 22, contentW - 54, descBoxH, 3, 3, "S");
  canvasText(doc, summaryText, rx + 4, y + 27, {
    size: 8.5, color: "#374151", maxWidth: contentW - 62,
  });

  y += 22 + descBoxH + 10;

  canvasText(doc, "영역별 경향 분석", margin, y, { size: 12, bold: true, color: "#2f7d5c" });
  y += 8;

  report.categoryInsights.forEach((item) => {
    const pct = item.percentage / 100;
    const barW = contentW - 58;
    const interpretationHeight = canvasText(doc, item.interpretation, margin + 5, y + 17, {
      size: 7.6, color: "#374151", maxWidth: contentW - 10, measureOnly: true
    });
    const checkHeight = canvasText(doc, `확인 포인트: ${item.checkPoint}`, margin + 5, y + 23 + interpretationHeight, {
      size: 7.4, color: "#666666", maxWidth: contentW - 10, measureOnly: true
    });
    const cardH = Math.max(31, 23 + interpretationHeight + checkHeight);

    if (y + cardH > pageH - 22) {
      doc.addPage();
      y = margin;
    }

    roundedRect(doc, margin, y, contentW, cardH, 3, "#f7fbf8");
    doc.setDrawColor(220, 225, 235);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentW, cardH, 3, 3, "S");

    canvasText(doc, item.category, margin + 5, y + 6, { size: 8.5, bold: true, color: "#2f7d5c" });
    canvasText(doc, `${item.score}/${item.max}점 · ${item.trendLabel}`, margin + contentW - 5, y + 6, {
      size: 7.5, color: "#666666", align: "right"
    });

    roundedRect(doc, margin + 5, y + 10, barW, 4, 2, "#d9e2dc");
    const fillColor = pct > 0.6 ? accentColor : "#2f7d5c";
    if (pct > 0) {
      roundedRect(doc, margin + 5, y + 10, Math.max(barW * pct, 2), 4, 2, fillColor);
    }
    canvasText(doc, `${item.percentage}%`, margin + contentW - 5, y + 14, { size: 7.2, color: "#888888", align: "right" });

    canvasText(doc, item.interpretation, margin + 5, y + 17, {
      size: 7.6, color: "#374151", maxWidth: contentW - 10,
    });
    canvasText(doc, `확인 포인트: ${item.checkPoint}`, margin + 5, y + 23 + interpretationHeight, {
      size: 7.4, color: "#666666", maxWidth: contentW - 10,
    });

    y += cardH + 4;
  });

  y += 4;

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

  canvasText(doc, "문항별 응답 요약", margin, y, { size: 12, bold: true, color: "#2f7d5c" });
  y += 7;

  rect(doc, margin, y - 3, contentW, 7, "#2f7d5c");
  canvasText(doc, "번호", margin + 3, y + 1, { size: 8, bold: true, color: "#ffffff" });
  canvasText(doc, "문항", margin + 18, y + 1, { size: 8, bold: true, color: "#ffffff" });
  canvasText(doc, "응답", margin + contentW - 3, y + 1, { size: 8, bold: true, color: "#ffffff", align: "right" });
  y += 8;

  const ansColorMap: Record<number, string> = {
    0: "#888888", 1: "#64748b", 2: "#d97706", 3: "#dc2626",
  };

  questionSet.questions.forEach((q, i) => {
    const qTextLines = canvasText(doc, q.text, margin + 18, y + 1, { size: 8, maxWidth: contentW - 40, measureOnly: true });
    const rowH = Math.max(7, qTextLines + 3);

    if (y + rowH > pageH - 22) {
      doc.addPage();
      y = margin;
    }

    const rowBg = i % 2 === 0 ? "#f7fbf8" : "#ffffff";
    rect(doc, margin, y - 3, contentW, rowH, rowBg);

    canvasText(doc, `${q.id}`, margin + 3, y + 1, { size: 8, color: "#666666" });

    canvasText(doc, q.text, margin + 18, y + 1, { size: 8, color: "#333333", maxWidth: contentW - 40 });

    const ansVal = answers[q.id];
    const ansLabel = ansVal !== undefined
      ? answerOptions.find((a) => a.value === ansVal)?.label || "-"
      : "-";
    const ansColor = ansVal !== undefined ? ansColorMap[ansVal] ?? "#888888" : "#888888";
    canvasText(doc, ansLabel, margin + contentW - 3, y + 1, { size: 8, color: ansColor, align: "right" });

    y += rowH;
  });

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
