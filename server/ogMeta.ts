/**
 * ogMeta.ts
 * 결과 페이지(/result) 접근 시 쿼리 파라미터(type, score)를 읽어
 * 결과 유형에 맞는 OG 메타태그가 포함된 HTML을 반환하는 Express 라우트.
 *
 * SNS 크롤러는 JS를 실행하지 않으므로 서버에서 직접 HTML을 생성해야 함.
 * 일반 브라우저 접근은 동일한 HTML을 받아 React SPA로 정상 동작.
 */
import { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 결과 유형별 OG 메타 데이터 정의
interface OGMeta {
  title: string;
  description: string;
  imageKey: string; // /manus-storage/... 경로
}

const BASE_URL = "https://maumium.kr";

// 성인 결과 레벨별 메타 (score 기준)
function getAdultMeta(score: number): OGMeta {
  if (score <= 10) {
    return {
      title: "저위험 수준 — 마음이음 성인 자가진단 결과",
      description: `경계선 지능 가능성이 낮습니다. 마음이음 성인 자가진단 결과를 확인해 보세요. (점수: ${score}점)`,
      imageKey: "/manus-storage/og-result-adult-low-1200x630_03064a13.png",
    };
  } else if (score <= 22) {
    return {
      title: "가벼운 어려움 수준 — 마음이음 성인 자가진단 결과",
      description: `일부 영역에서 가벼운 어려움이 확인됩니다. 마음이음 성인 자가진단 결과를 확인해 보세요. (점수: ${score}점)`,
      imageKey: "/manus-storage/og-result-adult-high-1200x630_dd505b47.png",
    };
  } else if (score <= 33) {
    return {
      title: "주의 수준 — 마음이음 성인 자가진단 결과",
      description: `전문가 상담이 권장됩니다. 마음이음 성인 자가진단 결과를 확인해 보세요. (점수: ${score}점)`,
      imageKey: "/manus-storage/og-result-adult-high-1200x630_dd505b47.png",
    };
  } else {
    return {
      title: "주의 수준 (적극 권장) — 마음이음 성인 자가진단 결과",
      description: `전문기관 상담을 적극 권장합니다. 마음이음 성인 자가진단 결과를 확인해 보세요. (점수: ${score}점)`,
      imageKey: "/manus-storage/og-result-adult-high-1200x630_dd505b47.png",
    };
  }
}

// 아동 결과 레벨별 메타 (score 기준)
function getChildMeta(score: number): OGMeta {
  if (score <= 12) {
    return {
      title: "저위험 수준 — 마음이음 아동 선별검사 결과",
      description: `또래와 비슷하게 잘 성장 중입니다. 마음이음 아동 선별검사 결과를 확인해 보세요. (점수: ${score}점)`,
      imageKey: "/manus-storage/og-result-child-low-1200x630_901d6613.png",
    };
  } else if (score <= 26) {
    return {
      title: "가벼운 지원 권장 — 마음이음 아동 선별검사 결과",
      description: `일부 영역에서 추가 관찰이 필요합니다. 마음이음 아동 선별검사 결과를 확인해 보세요. (점수: ${score}점)`,
      imageKey: "/manus-storage/og-result-child-high-1200x630_5cbfb1bb.png",
    };
  } else if (score <= 40) {
    return {
      title: "주의 수준 — 마음이음 아동 선별검사 결과",
      description: `전문기관 방문을 권장합니다. 마음이음 아동 선별검사 결과를 확인해 보세요. (점수: ${score}점)`,
      imageKey: "/manus-storage/og-result-child-high-1200x630_5cbfb1bb.png",
    };
  } else {
    return {
      title: "주의 수준 (적극 권장) — 마음이음 아동 선별검사 결과",
      description: `전문기관 방문을 적극 권장합니다. 마음이음 아동 선별검사 결과를 확인해 보세요. (점수: ${score}점)`,
      imageKey: "/manus-storage/og-result-child-high-1200x630_5cbfb1bb.png",
    };
  }
}

// 기본 OG 메타 (결과 파라미터 없을 때)
const DEFAULT_META: OGMeta = {
  title: "경계선 지능 자가진단 | 마음이음 — 무료 온라인 선별검사",
  description:
    "경계선 지능(IQ 71~84) 자가진단 및 아동 선별검사. 5~10분으로 간편하게 확인하세요. 무료, 개인정보 저장 없음.",
  imageKey: "/manus-storage/og-thumbnail-v2-1200x630_a2d31454.png",
};

/**
 * index.html을 읽어 <head> 내 OG 메타태그를 동적으로 교체한 HTML 반환
 */
function buildHtml(indexHtml: string, meta: OGMeta, canonicalUrl: string): string {
  const absoluteImage = `${BASE_URL}${meta.imageKey}`;

  return indexHtml
    // og:title
    .replace(
      /<meta property="og:title"[^>]*>/,
      `<meta property="og:title" content="${escapeAttr(meta.title)}" />`
    )
    // og:description
    .replace(
      /<meta property="og:description"[^>]*>/,
      `<meta property="og:description" content="${escapeAttr(meta.description)}" />`
    )
    // og:image
    .replace(
      /<meta property="og:image"[^>]*>/,
      `<meta property="og:image" content="${escapeAttr(absoluteImage)}" />`
    )
    // og:url
    .replace(
      /<meta property="og:url"[^>]*>/,
      `<meta property="og:url" content="${escapeAttr(canonicalUrl)}" />`
    )
    // twitter:title
    .replace(
      /<meta name="twitter:title"[^>]*>/,
      `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`
    )
    // twitter:description
    .replace(
      /<meta name="twitter:description"[^>]*>/,
      `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`
    )
    // twitter:image
    .replace(
      /<meta name="twitter:image"[^>]*>/,
      `<meta name="twitter:image" content="${escapeAttr(absoluteImage)}" />`
    )
    // <title>
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
    // canonical
    .replace(
      /<link rel="canonical"[^>]*>/,
      `<link rel="canonical" href="${escapeAttr(canonicalUrl)}" />`
    );
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Express 앱에 /result 동적 OG 라우트 등록
 */
export function registerOgMetaRoute(app: Express, indexHtmlPath: string): void {
  app.get("/result", (req, res) => {
    // index.html을 매 요청마다 읽어 최신 상태 반영 (개발 중 캐시 방지)
    let indexHtml: string;
    try {
      indexHtml = fs.readFileSync(indexHtmlPath, "utf-8");
    } catch {
      // 파일을 읽을 수 없으면 (개발 모드 Vite 서버) 그냥 패스
      res.status(404).send("Not found");
      return;
    }

    const type = (req.query.type as string) || "";
    const scoreRaw = parseInt((req.query.score as string) || "0", 10);
    const score = isNaN(scoreRaw) ? 0 : scoreRaw;

    let meta: OGMeta;
    if (type === "adult") {
      meta = getAdultMeta(score);
    } else if (type === "child") {
      meta = getChildMeta(score);
    } else {
      meta = DEFAULT_META;
    }

    const canonicalUrl = `${BASE_URL}/result?type=${encodeURIComponent(type)}&score=${score}`;
    const html = buildHtml(indexHtml, meta, canonicalUrl);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    // 크롤러 캐시 1시간, 브라우저 캐시 없음
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    res.send(html);
  });
}
