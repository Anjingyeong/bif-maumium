/**
 * sitemap.xml 자동 생성 스크립트
 * 실행: node scripts/generate-sitemap.mjs [BASE_URL]
 * 예시: node scripts/generate-sitemap.mjs https://maumium.kr
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = process.argv[2] || "https://bif-screening.manus.space";

const today = new Date().toISOString().split("T")[0];

// 모든 페이지 목록 (경로, 우선순위, 변경 빈도)
const pages = [
  { path: "/",             priority: "1.0", changefreq: "weekly"  },
  { path: "/test/adult",   priority: "0.9", changefreq: "monthly" },
  { path: "/test/child",   priority: "0.9", changefreq: "monthly" },
  { path: "/info",         priority: "0.8", changefreq: "monthly" },
  { path: "/term-diff",    priority: "0.8", changefreq: "monthly" },
  { path: "/blog",         priority: "0.7", changefreq: "weekly"  },
  { path: "/blog/bif-symptoms-adults",        priority: "0.7", changefreq: "monthly" },
  { path: "/blog/bif-child-parent-guide",     priority: "0.7", changefreq: "monthly" },
  { path: "/blog/bif-self-diagnosis-guide",   priority: "0.7", changefreq: "monthly" },
  { path: "/blog/bif-support-policy-2024",    priority: "0.7", changefreq: "monthly" },
  { path: "/history",      priority: "0.5", changefreq: "never"   },
  { path: "/privacy",      priority: "0.3", changefreq: "yearly"  },
];

const urlEntries = pages
  .map(
    ({ path, priority, changefreq }) => `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>
`;

const outputPath = resolve(__dirname, "../client/public/sitemap.xml");
writeFileSync(outputPath, sitemap, "utf-8");

console.log(`✅ sitemap.xml 생성 완료: ${outputPath}`);
console.log(`📍 기준 URL: ${BASE_URL}`);
console.log(`📄 총 ${pages.length}개 페이지 등록`);
console.log(`\n🔍 Google Search Console 등록 URL:`);
console.log(`   ${BASE_URL}/sitemap.xml`);
