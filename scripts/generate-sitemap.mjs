/**
 * sitemap.xml generator
 * Usage: node scripts/generate-sitemap.mjs [BASE_URL]
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = (process.argv[2] || "https://maumium.pages.dev").replace(/\/$/, "");
const today = new Date().toISOString().split("T")[0];

const pages = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/test/adult", priority: "0.9", changefreq: "monthly" },
  { path: "/test/child", priority: "0.9", changefreq: "monthly" },
  { path: "/info", priority: "0.8", changefreq: "monthly" },
  { path: "/term-diff", priority: "0.8", changefreq: "monthly" },
  { path: "/slow-learner-test", priority: "0.9", changefreq: "monthly" },
  { path: "/borderline-iq-test", priority: "0.9", changefreq: "monthly" },
  { path: "/slow-learner-checklist", priority: "0.8", changefreq: "monthly" },
  { path: "/slow-learner-vs-borderline-iq", priority: "0.8", changefreq: "monthly" },
  { path: "/blog", priority: "0.7", changefreq: "weekly" },
  { path: "/blog/what-is-borderline-intelligence", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/child-borderline-intelligence-parents-guide", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/adult-borderline-intelligence-self-check", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/borderline-intelligence-support-2026", priority: "0.7", changefreq: "monthly" },
  { path: "/faq", priority: "0.6", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
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
const sitemapIndexPath = resolve(__dirname, "../client/public/sitemap-index.xml");
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`;

writeFileSync(outputPath, sitemap, "utf-8");
writeFileSync(sitemapIndexPath, sitemapIndex, "utf-8");

console.log(`sitemap.xml generated: ${outputPath}`);
console.log(`sitemap-index.xml generated: ${sitemapIndexPath}`);
console.log(`Base URL: ${BASE_URL}`);
console.log(`Pages: ${pages.length}`);
console.log(`Submit to Search Console: ${BASE_URL}/sitemap.xml`);
