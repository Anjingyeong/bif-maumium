/**
 * PDF Report Generator — html2canvas + jsPDF 방식
 * 결과 페이지의 실제 렌더링을 캡처하여 PDF로 저장합니다.
 * 한글 폰트가 완벽하게 지원됩니다.
 */
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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

/**
 * 결과 리포트용 HTML 문자열을 생성합니다.
 * 이 HTML은 숨겨진 div에 렌더링된 뒤 html2canvas로 캡처됩니다.
 */
function buildReportHtml(params: GeneratePdfParams): string {
  const { type, score, maxScore, result, answers, questionSet } = params;
  const percentage = Math.round((score / maxScore) * 100);
  const categoryScores = getCategoryScores(answers, questionSet.questions);
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const typeLabel = type === "adult" ? "성인 자가진단" : "아동 선별검사 (학부모용)";

  const levelColorMap: Record<string, string> = {
    low: "#4caf82",
    mild: "#d4a017",
    moderate: "#e07030",
    high: "#c83232",
  };
  const levelBgMap: Record<string, string> = {
    low: "#edfaf3",
    mild: "#fdf8e8",
    moderate: "#fdf0e8",
    high: "#fde8e8",
  };
  const accentColor = levelColorMap[result.level] || "#5070c8";
  const accentBg = levelBgMap[result.level] || "#eef1fa";

  // 영역별 분석 바 HTML
  const categoryRows = Object.entries(categoryScores)
    .map(([cat, { score: cs, max }]) => {
      const pct = Math.round((cs / max) * 100);
      const barColor = pct > 60 ? accentColor : "#5070c8";
      return `
        <div style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <span style="font-size:12px;font-weight:600;color:#2a3a5a;">${cat}</span>
            <span style="font-size:11px;color:#888;">${cs}/${max} (${pct}%)</span>
          </div>
          <div style="height:8px;background:#e5e8f0;border-radius:4px;overflow:hidden;">
            <div style="height:100%;width:${pct}%;background:${barColor};border-radius:4px;"></div>
          </div>
        </div>`;
    })
    .join("");

  // 문항별 응답 행 HTML
  const answerRows = questionSet.questions
    .map((q, i) => {
      const ansVal = answers[q.id];
      const ansLabel =
        ansVal !== undefined
          ? answerOptions.find((a) => a.value === ansVal)?.label || "-"
          : "-";
      const ansColorMap: Record<number, string> = {
        0: "#888",
        1: "#4caf82",
        2: "#d4a017",
        3: "#c83232",
      };
      const ansColor = ansVal !== undefined ? ansColorMap[ansVal] ?? "#888" : "#888";
      const rowBg = i % 2 === 0 ? "#f7f8fc" : "#ffffff";
      return `
        <tr style="background:${rowBg};">
          <td style="padding:5px 8px;font-size:11px;color:#666;width:32px;text-align:center;">${q.id}</td>
          <td style="padding:5px 8px;font-size:11px;color:#333;line-height:1.4;">${q.text}</td>
          <td style="padding:5px 8px;font-size:11px;font-weight:600;color:${ansColor};width:80px;text-align:center;">${ansLabel}</td>
        </tr>`;
    })
    .join("");

  return `
    <div id="pdf-report" style="
      width:794px;
      font-family:'Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',sans-serif;
      background:#ffffff;
      color:#2a3a5a;
      padding:0;
      box-sizing:border-box;
    ">
      <!-- 헤더 -->
      <div style="background:#2a3a5a;padding:28px 36px 24px;display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;margin-bottom:4px;">마음이음</div>
          <div style="font-size:13px;color:#b0c4e8;">경계선 지능 선별검사 결과 리포트</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:12px;font-weight:600;color:#ffd9a0;margin-bottom:4px;">${typeLabel}</div>
          <div style="font-size:11px;color:#b0c4e8;">${today}</div>
        </div>
      </div>

      <!-- 면책 배너 -->
      <div style="background:#fff8e8;padding:8px 36px;border-bottom:1px solid #f0e0b0;">
        <span style="font-size:10px;color:#9a7020;">⚠ 본 결과는 선별 목적의 참고 자료이며, 의학적 진단을 대체하지 않습니다.</span>
      </div>

      <!-- 결과 요약 -->
      <div style="padding:28px 36px 20px;display:flex;gap:24px;align-items:flex-start;border-bottom:1px solid #eaecf4;">
        <!-- 점수 원형 -->
        <div style="
          width:100px;height:100px;border-radius:50%;
          background:conic-gradient(${accentColor} 0% ${percentage}%, #e5e8f0 ${percentage}% 100%);
          display:flex;align-items:center;justify-content:center;
          flex-shrink:0;
          position:relative;
        ">
          <div style="
            width:72px;height:72px;border-radius:50%;background:#fff;
            display:flex;flex-direction:column;align-items:center;justify-content:center;
          ">
            <span style="font-size:22px;font-weight:700;color:#2a3a5a;line-height:1;">${score}</span>
            <span style="font-size:10px;color:#888;margin-top:2px;">/ ${maxScore}</span>
          </div>
        </div>
        <!-- 결과 텍스트 -->
        <div style="flex:1;">
          <div style="font-size:20px;font-weight:700;color:#2a3a5a;margin-bottom:6px;">${result.title}</div>
          <div style="font-size:12px;color:#666;margin-bottom:10px;">총점 ${score}점 / ${maxScore}점 (${percentage}%)</div>
          <div style="background:${accentBg};border-left:3px solid ${accentColor};padding:10px 14px;border-radius:0 6px 6px 0;">
            <p style="font-size:12px;color:#444;line-height:1.7;margin:0;">${result.description}</p>
          </div>
        </div>
      </div>

      <!-- 영역별 분석 -->
      <div style="padding:24px 36px 20px;border-bottom:1px solid #eaecf4;">
        <div style="font-size:15px;font-weight:700;color:#2a3a5a;margin-bottom:14px;">영역별 분석</div>
        ${categoryRows}
      </div>

      <!-- 권장 사항 -->
      <div style="padding:24px 36px 20px;border-bottom:1px solid #eaecf4;">
        <div style="font-size:15px;font-weight:700;color:#2a3a5a;margin-bottom:12px;">권장 사항</div>
        <div style="background:#f0f4ff;border:1px solid #d0d8f0;border-radius:8px;padding:14px 18px;">
          <p style="font-size:12px;color:#3a4a7a;line-height:1.8;margin:0;">${result.recommendation}</p>
        </div>
      </div>

      <!-- 문항별 응답 요약 -->
      <div style="padding:24px 36px 28px;">
        <div style="font-size:15px;font-weight:700;color:#2a3a5a;margin-bottom:12px;">문항별 응답 요약</div>
        <table style="width:100%;border-collapse:collapse;font-size:11px;">
          <thead>
            <tr style="background:#2a3a5a;">
              <th style="padding:7px 8px;color:#fff;text-align:center;width:32px;">번호</th>
              <th style="padding:7px 8px;color:#fff;text-align:left;">문항</th>
              <th style="padding:7px 8px;color:#fff;text-align:center;width:80px;">응답</th>
            </tr>
          </thead>
          <tbody>
            ${answerRows}
          </tbody>
        </table>
      </div>

      <!-- 푸터 -->
      <div style="background:#2a3a5a;padding:12px 36px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:10px;color:#b0c4e8;">마음이음 경계선 지능 선별검사 | ${today}</span>
        <span style="font-size:10px;color:#8090b0;">본 결과는 의학적 진단을 대체하지 않습니다.</span>
      </div>
    </div>`;
}

/**
 * 결과 PDF를 생성하고 다운로드합니다.
 * html2canvas로 HTML을 이미지로 캡처한 뒤 jsPDF에 삽입합니다.
 */
export async function generateResultPdf(params: GeneratePdfParams): Promise<void> {
  const { type } = params;

  // 1. 숨겨진 컨테이너에 리포트 HTML 삽입
  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: 794px;
    background: #ffffff;
    z-index: -1;
    font-family: 'Noto Sans KR', 'Malgun Gothic', sans-serif;
  `;
  container.innerHTML = buildReportHtml(params);
  document.body.appendChild(container);

  // 폰트 로딩 대기
  await document.fonts.ready;
  // 렌더링 안정화 대기
  await new Promise((r) => setTimeout(r, 300));

  try {
    // 2. html2canvas로 캡처
    const canvas = await html2canvas(container.firstElementChild as HTMLElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: 794,
    });

    // 3. jsPDF에 이미지 삽입 (A4 비율 맞춤)
    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const imgWidth = 210; // A4 mm
    const imgHeight = (canvas.height / canvas.width) * imgWidth;

    const pageHeight = 297; // A4 mm
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    let yOffset = 0;
    let pageCount = 0;

    while (yOffset < imgHeight) {
      if (pageCount > 0) doc.addPage();

      // 현재 페이지에 해당하는 이미지 슬라이스를 그립니다
      doc.addImage(
        imgData,
        "JPEG",
        0,
        -yOffset,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );

      yOffset += pageHeight;
      pageCount++;
    }

    // 4. 파일명 생성 및 저장
    const today = new Date()
      .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
      .replace(/\. /g, "-")
      .replace(".", "");
    const filename = `마음이음_${type === "adult" ? "성인자가진단" : "아동선별검사"}_${today}.pdf`;
    doc.save(filename);
  } finally {
    document.body.removeChild(container);
  }
}
