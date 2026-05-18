/**
 * PDF Report Generator — jsPDF 직접 렌더링 방식
 *
 * html2canvas를 사용하면 내부적으로 document.open()/write()를 호출하는 hidden iframe을
 * 생성하여 Wouter 라우터의 히스토리 상태를 초기화시키는 버그가 발생합니다.
 * 따라서 jsPDF만으로 직접 PDF를 그리는 방식을 사용합니다.
 *
 * 한글 처리: jsPDF 기본 폰트는 한글을 지원하지 않으므로,
 * 텍스트를 Canvas API로 래스터화한 뒤 이미지로 삽입하는 방식을 사용합니다.
 * 이 방식은 iframe을 전혀 생성하지 않아 라우터에 영향을 주지 않습니다.
 */
import jsPDF from "jspdf";
import {
  ResultLevel,
  QuestionSet,
  AnswerValue,
  getCategoryScores,
  answerOptions,
} from "./questions";

export interface GeneratePdfParams {
  type: "adult" | "child";
  score: number;
  maxScore: number;
  result: ResultLevel;
  answers: Record<number, AnswerValue>;
  questionSet: QuestionSet;
}

// ─── Canvas 텍스트 렌더링 헬퍼 ──────────────────────────────────────────────

/**
 * Canvas를 사용해 한글 텍스트를 이미지로 변환 후 jsPDF에 삽입합니다.
 * iframe을 전혀 사용하지 않으므로 라우터 상태에 영향을 주지 않습니다.
 */
function canvasText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  opts: {
    size?: number;
    bold?: boolean;
    color?: string;
    align?: "left" | "center" | "right";
    maxWidth?: number;
  } = {}
) {
  const { size = 10, bold = false, color = "#28283c", align = "left", maxWidth } = opts;

  const scale = 3; // 해상도 배율
  const fontSize = size * scale;
  const fontStyle = bold ? "bold" : "normal";
  const fontFamily = "'Pretendard', 'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', Arial, sans-serif";

  // 임시 캔버스로 텍스트 너비 측정
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d")!;
  measureCtx.font = `${fontStyle} ${fontSize}px ${fontFamily}`;

  // 줄 바꿈 처리
  let lines: string[] = [];
  if (maxWidth) {
    const words = text.split(" ");
    let currentLine = "";
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = measureCtx.measureText(testLine).width / scale;
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
  } else {
    lines = [text];
  }

  lines.forEach((line, lineIdx) => {
    const textWidth = measureCtx.measureText(line).width / scale;
    const canvasW = Math.ceil(textWidth * scale) + 4;
    const canvasH = Math.ceil(fontSize * 1.4);

    const canvas = document.createElement("canvas");
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext("2d")!;

    ctx.font = `${fontStyle} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textBaseline = "top";
    ctx.fillText(line, 2, 2);

    const imgData = canvas.toDataURL("image/png");
    const imgW = textWidth;
    const imgH = (size * 1.4);

    let drawX = x;
    if (align === "center") drawX = x - imgW / 2;
    else if (align === "right") drawX = x - imgW;

    const lineY = y - size * 0.85 + lineIdx * (size * 1.5);
    doc.addImage(imgData, "PNG", drawX, lineY, imgW, imgH);
  });
}

// ─── 도형 헬퍼 ──────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
}

function rect(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  color: string, filled = true
) {
  const [r, g, b] = hexToRgb(color);
  if (filled) {
    doc.setFillColor(r, g, b);
    doc.rect(x, y, w, h, "F");
  } else {
    doc.setDrawColor(r, g, b);
    doc.rect(x, y, w, h, "S");
  }
}

function roundedRect(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  radius: number, color: string, filled = true
) {
  const [r, g, b] = hexToRgb(color);
  if (filled) {
    doc.setFillColor(r, g, b);
    doc.roundedRect(x, y, w, h, radius, radius, "F");
  } else {
    doc.setDrawColor(r, g, b);
    doc.roundedRect(x, y, w, h, radius, radius, "S");
  }
}

// ─── 메인 PDF 생성 함수 ──────────────────────────────────────────────────────

export async function generateResultPdf(params: GeneratePdfParams): Promise<void> {
  const { type, score, maxScore, result, answers, questionSet } = params;
  const percentage = Math.round((score / maxScore) * 100);
  const categoryScores = getCategoryScores(answers, questionSet.questions);
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
  });
  const typeLabel = type === "adult" ? "성인 자가진단" : "아동 선별검사 (학부모용)";

  const levelColorMap: Record<string, string> = {
    low: "#4caf82",
    mild: "#d4a017",
    moderate: "#e07030",
    high: "#c83232",
  };
  const accentColor = levelColorMap[result.level] || "#5070c8";

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const pageH = 297;
  const margin = 18;
  const contentW = pageW - margin * 2;

  // 폰트 로딩 대기 (Canvas 텍스트 렌더링을 위해)
  if ("fonts" in document) {
    await Promise.allSettled([
      document.fonts.ready,
      document.fonts.load('400 16px "Pretendard"', "한글"),
      document.fonts.load('700 16px "Pretendard"', "한글"),
      document.fonts.load('400 16px "Noto Sans KR"', "한글"),
      document.fonts.load('700 16px "Noto Sans KR"', "한글"),
      document.fonts.load('400 16px "Malgun Gothic"', "한글"),
      document.fonts.load('700 16px "Malgun Gothic"', "한글"),
    ]);
  }

  // ─── Page 1 ────────────────────────────────────────────────────────────────

  // 헤더 배경
  rect(doc, 0, 0, pageW, 48, "#2a3a5a");

  // 헤더 텍스트
  canvasText(doc, "마음이음", margin, 16, { size: 18, bold: true, color: "#ffffff" });
  canvasText(doc, "경계선 지능 선별검사 결과 리포트", margin, 28, { size: 10, color: "#b0c4e8" });
  canvasText(doc, typeLabel, pageW - margin, 16, { size: 10, bold: true, color: "#ffd9a0", align: "right" });
  canvasText(doc, today, pageW - margin, 28, { size: 9, color: "#b0c4e8", align: "right" });

  // 면책 배너
  rect(doc, 0, 48, pageW, 10, "#fff8e8");
  canvasText(doc, "⚠  본 결과는 선별 목적의 참고 자료이며, 의학적 진단을 대체하지 않습니다.", pageW / 2, 55, {
    size: 8, color: "#9a7020", align: "center",
  });

  let y = 70;

  // ─── 점수 원형 ────────────────────────────────────────────────────────────
  const cx = margin + 24;
  const cy = y + 18;
  const r = 18;

  // 배경 원
  doc.setFillColor(230, 235, 245);
  doc.circle(cx, cy, r, "F");

  // 색상 원 (레벨 색)
  const [ar, ag, ab] = hexToRgb(accentColor);
  doc.setFillColor(ar, ag, ab);
  doc.circle(cx, cy, r, "F");

  // 흰색 내부 원
  doc.setFillColor(255, 255, 255);
  doc.circle(cx, cy, r * 0.72, "F");

  // 점수 텍스트
  canvasText(doc, `${score}`, cx, cy - 1, { size: 13, bold: true, color: "#2a3a5a", align: "center" });
  canvasText(doc, `/ ${maxScore}`, cx, cy + 6, { size: 8, color: "#888888", align: "center" });

  // ─── 결과 텍스트 ──────────────────────────────────────────────────────────
  const rx = margin + 52;
  canvasText(doc, result.title, rx, y + 8, { size: 15, bold: true, color: "#2a3a5a" });
  canvasText(doc, `총점 ${score}점 / ${maxScore}점 (${percentage}%)`, rx, y + 18, { size: 9, color: "#666666" });

  // 설명 박스
  roundedRect(doc, rx, y + 22, contentW - 54, 22, 3, "#f0f4ff");
  doc.setDrawColor(180, 190, 220);
  doc.setLineWidth(0.4);
  doc.roundedRect(rx, y + 22, contentW - 54, 22, 3, 3, "S");
  canvasText(doc, result.description, rx + 4, y + 30, {
    size: 8.5, color: "#3a4a7a", maxWidth: contentW - 62,
  });

  y += 52;

  // ─── 영역별 분석 ──────────────────────────────────────────────────────────
  canvasText(doc, "영역별 분석", margin, y, { size: 12, bold: true, color: "#2a3a5a" });
  y += 8;

  const entries = Object.entries(categoryScores);
  entries.forEach(([category, { score: cs, max }]) => {
    const pct = cs / max;
    const barW = contentW - 40;

    canvasText(doc, category, margin, y + 3.5, { size: 8.5, bold: true, color: "#3a4a6a" });
    canvasText(doc, `${cs}/${max}`, margin + contentW, y + 3.5, { size: 8, color: "#888888", align: "right" });

    // 바 배경
    roundedRect(doc, margin + 26, y, barW, 4.5, 2, "#e5e8f0");
    // 바 채움
    const fillColor = pct > 0.6 ? accentColor : "#5070c8";
    if (pct > 0) {
      roundedRect(doc, margin + 26, y, Math.max(barW * pct, 2), 4.5, 2, fillColor);
    }

    y += 9;
  });

  y += 4;

  // ─── 권장 사항 ────────────────────────────────────────────────────────────
  canvasText(doc, "권장 사항", margin, y, { size: 12, bold: true, color: "#2a3a5a" });
  y += 6;

  roundedRect(doc, margin, y, contentW, 26, 3, "#f0f4ff");
  doc.setDrawColor(180, 190, 220);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentW, 26, 3, 3, "S");
  canvasText(doc, result.recommendation, margin + 5, y + 8, {
    size: 8.5, color: "#3a4a7a", maxWidth: contentW - 10,
  });

  y += 34;

  // ─── 문항별 응답 요약 ─────────────────────────────────────────────────────
  if (y < pageH - 60) {
    canvasText(doc, "문항별 응답 요약", margin, y, { size: 12, bold: true, color: "#2a3a5a" });
    y += 7;

    // 테이블 헤더
    rect(doc, margin, y - 3, contentW, 7, "#2a3a5a");
    canvasText(doc, "번호", margin + 3, y + 1, { size: 8, bold: true, color: "#ffffff" });
    canvasText(doc, "문항", margin + 18, y + 1, { size: 8, bold: true, color: "#ffffff" });
    canvasText(doc, "응답", margin + contentW - 3, y + 1, { size: 8, bold: true, color: "#ffffff", align: "right" });
    y += 8;

    const ansColorMap: Record<number, string> = {
      0: "#888888", 1: "#4caf82", 2: "#d4a017", 3: "#c83232",
    };

    questionSet.questions.forEach((q, i) => {
      if (y > pageH - 22) {
        // 페이지 푸터
        rect(doc, 0, pageH - 12, pageW, 12, "#2a3a5a");
        canvasText(doc, `마음이음 경계선 지능 선별검사  |  ${today}`, pageW / 2, pageH - 5, {
          size: 7, color: "#b0c4e8", align: "center",
        });
        doc.addPage();
        y = margin;
      }

      const rowBg = i % 2 === 0 ? "#f7f8fc" : "#ffffff";
      rect(doc, margin, y - 3, contentW, 7, rowBg);

      canvasText(doc, `${q.id}`, margin + 3, y + 1, { size: 8, color: "#666666" });

      const qText = q.text.length > 52 ? q.text.slice(0, 49) + "..." : q.text;
      canvasText(doc, qText, margin + 18, y + 1, { size: 8, color: "#333333" });

      const ansVal = answers[q.id];
      const ansLabel = ansVal !== undefined
        ? answerOptions.find((a) => a.value === ansVal)?.label || "-"
        : "-";
      const ansColor = ansVal !== undefined ? ansColorMap[ansVal] ?? "#888888" : "#888888";
      canvasText(doc, ansLabel, margin + contentW - 3, y + 1, { size: 8, color: ansColor, align: "right" });

      y += 7;
    });
  }

  // ─── 모든 페이지 푸터 ─────────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    rect(doc, 0, pageH - 12, pageW, 12, "#2a3a5a");
    canvasText(doc, `마음이음 경계선 지능 선별검사  |  ${today}  |  ${p} / ${totalPages}`, pageW / 2, pageH - 5, {
      size: 7, color: "#b0c4e8", align: "center",
    });
    canvasText(doc, "본 결과는 의학적 진단을 대체하지 않습니다.", pageW / 2, pageH - 9.5, {
      size: 6.5, color: "#8090b0", align: "center",
    });
  }

  // ─── 저장 ─────────────────────────────────────────────────────────────────
  const todayShort = new Date()
    .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    .replace(/\. /g, "-").replace(".", "");
  const filename = `마음이음_${type === "adult" ? "성인자가진단" : "아동선별검사"}_${todayShort}.pdf`;
  doc.save(filename);
}
