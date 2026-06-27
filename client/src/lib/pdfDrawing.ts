import jsPDF from "jspdf";

interface CanvasTextOptions {
  readonly size?: number;
  readonly bold?: boolean;
  readonly color?: string;
  readonly align?: "left" | "center" | "right";
  readonly maxWidth?: number;
  readonly measureOnly?: boolean;
}

export function canvasText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  opts: CanvasTextOptions = {}
): number {
  const { size = 10, bold = false, color = "#28283c", align = "left", maxWidth, measureOnly = false } = opts;
  const scale = 3;
  const FONT_SCALE = 0.35; // Scale factor to convert pixels to mm for professional A4 print size
  const fontSize = size * scale;
  const fontStyle = bold ? "bold" : "normal";
  const fontFamily = "'Pretendard', 'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', Arial, sans-serif";
  
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");

  if (!measureCtx) return 0;

  measureCtx.font = `${fontStyle} ${fontSize}px ${fontFamily}`;

  // Convert maxWidth from mm to pixels at target scale
  const maxWidthPx = maxWidth ? maxWidth / FONT_SCALE : undefined;
  const lines = wrapCanvasText(text, maxWidthPx, measureCtx, scale);
  const lineHeight = size * 1.5 * FONT_SCALE;

  if (measureOnly) return lines.length * lineHeight;

  lines.forEach((line, lineIdx) => {
    const textWidth = measureCtx.measureText(line).width / scale;
    const canvasW = Math.ceil(textWidth * scale) + 4;
    const canvasH = Math.ceil(fontSize * 1.4);
    const canvas = document.createElement("canvas");
    canvas.width = canvasW;
    canvas.height = canvasH;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.font = `${fontStyle} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textBaseline = "top";
    ctx.fillText(line, 2, 2);

    const imgData = canvas.toDataURL("image/png");
    const imgH = size * 1.4 * FONT_SCALE;
    const imgW = textWidth * FONT_SCALE;
    const lineY = y - (size * 0.85 * FONT_SCALE) + lineIdx * lineHeight;
    
    doc.addImage(imgData, "PNG", getAlignedX(x, imgW, align), lineY, imgW, imgH);
  });

  return lines.length * lineHeight;
}

export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

export function rect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  filled = true
): void {
  const [r, g, b] = hexToRgb(color);
  if (filled) {
    doc.setFillColor(r, g, b);
    doc.rect(x, y, w, h, "F");
    return;
  }

  doc.setDrawColor(r, g, b);
  doc.rect(x, y, w, h, "S");
}

export function roundedRect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  color: string,
  filled = true
): void {
  const [r, g, b] = hexToRgb(color);
  if (filled) {
    doc.setFillColor(r, g, b);
    doc.roundedRect(x, y, w, h, radius, radius, "F");
    return;
  }

  doc.setDrawColor(r, g, b);
  doc.roundedRect(x, y, w, h, radius, radius, "S");
}

function wrapCanvasText(
  text: string,
  maxWidth: number | undefined,
  measureCtx: CanvasRenderingContext2D,
  scale: number
): string[] {
  if (!maxWidth) return [text];

  const paragraphs = text.split("\n");
  const lines: string[] = [];

  paragraphs.forEach((p) => {
    let currentLine = "";
    for (let i = 0; i < p.length; i += 1) {
      const char = p[i];
      const testLine = currentLine + char;
      const testWidth = measureCtx.measureText(testLine).width / scale;
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
  });

  return lines;
}

function getAlignedX(x: number, textWidth: number, align: CanvasTextOptions["align"]): number {
  if (align === "center") return x - textWidth / 2;
  if (align === "right") return x - textWidth;
  return x;
}
