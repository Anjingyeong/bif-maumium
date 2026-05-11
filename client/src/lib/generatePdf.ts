/**
 * PDF Report Generator
 * 경계선 지능 자가진단 결과를 PDF로 생성합니다.
 * jsPDF를 사용하여 브라우저에서 직접 PDF를 생성합니다.
 */
import jsPDF from "jspdf";
import {
  ResultLevel,
  QuestionSet,
  AnswerValue,
  getCategoryScores,
  answerOptions,
} from "./questions";

export async function generateResultPdf(params: {
  type: "adult" | "child";
  score: number;
  maxScore: number;
  result: ResultLevel;
  answers: Record<number, AnswerValue>;
  questionSet: QuestionSet;
}) {
  const { type, score, maxScore, result, answers, questionSet } = params;
  const percentage = Math.round((score / maxScore) * 100);
  const categoryScores = getCategoryScores(answers, questionSet.questions);
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const pageH = 297;
  const margin = 20;
  const contentW = pageW - margin * 2;

  // ─── Helper functions ───────────────────────────────────────────
  const addText = (
    text: string,
    x: number,
    y: number,
    opts: {
      size?: number;
      bold?: boolean;
      color?: [number, number, number];
      align?: "left" | "center" | "right";
      maxWidth?: number;
    } = {}
  ) => {
    const { size = 10, bold = false, color = [40, 40, 60], align = "left", maxWidth } = opts;
    doc.setFontSize(size);
    doc.setTextColor(...color);
    if (bold) doc.setFont("helvetica", "bold");
    else doc.setFont("helvetica", "normal");
    if (maxWidth) {
      doc.text(text, x, y, { align, maxWidth });
    } else {
      doc.text(text, x, y, { align });
    }
  };

  const drawRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    color: [number, number, number],
    filled = true
  ) => {
    doc.setFillColor(...color);
    doc.setDrawColor(...color);
    if (filled) doc.rect(x, y, w, h, "F");
    else doc.rect(x, y, w, h, "S");
  };

  const drawRoundedRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    color: [number, number, number],
    filled = true
  ) => {
    doc.setFillColor(...color);
    doc.setDrawColor(...color);
    if (filled) doc.roundedRect(x, y, w, h, r, r, "F");
    else doc.roundedRect(x, y, w, h, r, r, "S");
  };

  // ─── Page 1: Cover & Summary ────────────────────────────────────
  // Header background
  drawRect(0, 0, pageW, 55, [42, 58, 90]);

  // Logo area
  addText("마음이음", margin, 22, { size: 18, bold: true, color: [255, 255, 255] });
  addText("경계선 지능 선별검사 결과 리포트", margin, 32, { size: 11, color: [200, 215, 240] });

  // Date & type badge
  const typeLabel = type === "adult" ? "성인 자가진단" : "아동 선별검사 (학부모용)";
  addText(typeLabel, pageW - margin, 22, { size: 10, bold: true, color: [255, 220, 180], align: "right" });
  addText(today, pageW - margin, 30, { size: 9, color: [200, 215, 240], align: "right" });

  // Disclaimer banner
  drawRect(0, 55, pageW, 10, [255, 245, 220]);
  addText(
    "⚠  본 결과는 선별 목적의 참고 자료이며, 의학적 진단을 대체하지 않습니다.",
    pageW / 2,
    61.5,
    { size: 8, color: [140, 100, 30], align: "center" }
  );

  let y = 80;

  // Score circle (simulated with concentric circles)
  const cx = margin + 30;
  const cy = y + 20;
  doc.setFillColor(230, 235, 245);
  doc.circle(cx, cy, 22, "F");

  // Score arc (filled sector approximation using colored circle + white circle)
  const levelColorMap: Record<string, [number, number, number]> = {
    low: [80, 180, 120],
    mild: [220, 170, 60],
    moderate: [220, 110, 60],
    high: [200, 60, 50],
  };
  const arcColor = levelColorMap[result.level] || [100, 130, 200];
  doc.setFillColor(...arcColor);
  doc.circle(cx, cy, 22, "F");
  doc.setFillColor(255, 255, 255);
  doc.circle(cx, cy, 16, "F");

  // Score text in circle
  addText(`${score}`, cx, cy - 1, { size: 14, bold: true, color: [40, 40, 60], align: "center" });
  addText(`/ ${maxScore}`, cx, cy + 5, { size: 8, color: [120, 120, 140], align: "center" });

  // Result title & description
  const rx = margin + 60;
  addText(result.title, rx, y + 8, { size: 16, bold: true, color: [42, 58, 90] });
  addText(`점수: ${score}점 / ${maxScore}점 (${percentage}%)`, rx, y + 16, {
    size: 10,
    color: [100, 100, 120],
  });

  // Description box
  drawRoundedRect(rx, y + 20, contentW - 60, 22, 3, [240, 243, 250]);
  const descLines = doc.splitTextToSize(result.description, contentW - 68);
  doc.setFontSize(9);
  doc.setTextColor(60, 70, 90);
  doc.setFont("helvetica", "normal");
  descLines.slice(0, 3).forEach((line: string, i: number) => {
    doc.text(line, rx + 4, y + 27 + i * 5);
  });

  y += 60;

  // ─── Category Breakdown ─────────────────────────────────────────
  addText("영역별 분석", margin, y, { size: 13, bold: true, color: [42, 58, 90] });
  y += 8;

  const entries = Object.entries(categoryScores);
  entries.forEach(([category, { score: catScore, max }]) => {
    const catPct = catScore / max;
    const barW = contentW - 50;

    addText(category, margin, y + 4, { size: 9, bold: true, color: [60, 70, 90] });
    addText(`${catScore}/${max}`, margin + contentW, y + 4, {
      size: 8,
      color: [120, 120, 140],
      align: "right",
    });

    // Bar background
    drawRoundedRect(margin + 28, y, barW, 5, 2, [225, 228, 238]);
    // Bar fill
    const fillColor: [number, number, number] =
      catPct > 0.6 ? arcColor : [80, 110, 180];
    drawRoundedRect(margin + 28, y, Math.max(barW * catPct, 2), 5, 2, fillColor);

    y += 10;
  });

  y += 6;

  // ─── Recommendation ─────────────────────────────────────────────
  addText("권장 사항", margin, y, { size: 13, bold: true, color: [42, 58, 90] });
  y += 6;

  drawRoundedRect(margin, y, contentW, 28, 4, [245, 248, 255]);
  doc.setDrawColor(180, 190, 220);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentW, 28, 4, 4, "S");

  const recLines = doc.splitTextToSize(result.recommendation, contentW - 10);
  doc.setFontSize(9.5);
  doc.setTextColor(50, 60, 90);
  doc.setFont("helvetica", "normal");
  recLines.slice(0, 4).forEach((line: string, i: number) => {
    doc.text(line, margin + 5, y + 8 + i * 6);
  });

  y += 36;

  // ─── Answer Summary ─────────────────────────────────────────────
  if (y < pageH - 80) {
    addText("문항별 응답 요약", margin, y, { size: 13, bold: true, color: [42, 58, 90] });
    y += 8;

    // Table header
    drawRect(margin, y - 4, contentW, 7, [42, 58, 90]);
    addText("번호", margin + 3, y + 0.5, { size: 8, bold: true, color: [255, 255, 255] });
    addText("문항", margin + 18, y + 0.5, { size: 8, bold: true, color: [255, 255, 255] });
    addText("응답", margin + contentW - 3, y + 0.5, {
      size: 8,
      bold: true,
      color: [255, 255, 255],
      align: "right",
    });
    y += 8;

    questionSet.questions.forEach((q, i) => {
      if (y > pageH - 30) {
        doc.addPage();
        y = margin;
      }
      const rowBg: [number, number, number] = i % 2 === 0 ? [250, 251, 255] : [255, 255, 255];
      drawRect(margin, y - 4, contentW, 7, rowBg);

      addText(`${q.id}`, margin + 3, y + 0.5, { size: 8, color: [80, 90, 110] });

      const qText = q.text.length > 55 ? q.text.slice(0, 52) + "..." : q.text;
      addText(qText, margin + 18, y + 0.5, { size: 8, color: [50, 60, 80] });

      const ansVal = answers[q.id];
      const ansLabel =
        ansVal !== undefined
          ? answerOptions.find((a) => a.value === ansVal)?.label || "-"
          : "-";
      const ansColor: [number, number, number] =
        ansVal === 3
          ? [200, 60, 50]
          : ansVal === 2
          ? [200, 130, 40]
          : ansVal === 1
          ? [80, 150, 80]
          : [120, 130, 150];
      addText(ansLabel, margin + contentW - 3, y + 0.5, {
        size: 8,
        color: ansColor,
        align: "right",
      });

      y += 7;
    });
  }

  // ─── Footer on last page ─────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawRect(0, pageH - 14, pageW, 14, [42, 58, 90]);
    addText(
      `마음이음 경계선 지능 선별검사  |  ${today}  |  ${p} / ${totalPages}`,
      pageW / 2,
      pageH - 5,
      { size: 7.5, color: [180, 195, 225], align: "center" }
    );
    addText(
      "본 결과는 의학적 진단을 대체하지 않습니다. 정확한 진단은 전문기관을 통해 받으시기 바랍니다.",
      pageW / 2,
      pageH - 9,
      { size: 7, color: [160, 175, 210], align: "center" }
    );
  }

  // ─── Save ────────────────────────────────────────────────────────
  const filename = `마음이음_경계선지능_${type === "adult" ? "성인자가진단" : "아동선별검사"}_${today.replace(/\s/g, "").replace(/년|월/g, "-").replace("일", "")}.pdf`;
  doc.save(filename);
}
