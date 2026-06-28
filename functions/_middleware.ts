import { getSeoMeta } from "../shared/seoMeta";

export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 1. Bypass non-GET requests
  if (request.method !== "GET") {
    return next();
  }

  // 2. Bypass static assets and files based on extension
  const bypassExtensions = [
    ".js", ".css", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",
    ".woff", ".woff2", ".ttf", ".eot", ".json", ".xml", ".webmanifest", ".txt", ".pdf"
  ];
  if (bypassExtensions.some(ext => pathname.endsWith(ext))) {
    return next();
  }

  // Also bypass API requests explicitly
  if (pathname.startsWith("/api/")) {
    return next();
  }

  // Get the original HTML response
  const response = await next();
  const contentType = response.headers.get("content-type") || "";

  // 3. Only rewrite if the content type is text/html
  if (!contentType.includes("text/html")) {
    return response;
  }

  // Fetch target metadata
  const meta = getSeoMeta(pathname);
  if (!meta) {
    return response;
  }

  // 4. Inject route-specific metadata and crawlable summary using HTMLRewriter
  return new HTMLRewriter()
    .on("head", {
      element(el) {
        const metaTags = `
          <!-- BEGIN maumium server-side seo injection -->
          <title>${escapeHtml(meta.title)}</title>
          <meta name="description" content="${escapeHtml(meta.description)}" />
          <link rel="canonical" href="${escapeHtml(meta.canonical)}" />
          <meta property="og:title" content="${escapeHtml(meta.ogTitle)}" />
          <meta property="og:description" content="${escapeHtml(meta.ogDescription)}" />
          <meta property="og:type" content="${escapeHtml(meta.ogType)}" />
          <meta property="og:url" content="${escapeHtml(meta.canonical)}" />
          <meta property="og:image" content="${escapeHtml(meta.ogImage)}" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta name="twitter:card" content="${escapeHtml(meta.twitterCard)}" />
          <meta name="twitter:title" content="${escapeHtml(meta.twitterTitle)}" />
          <meta name="twitter:description" content="${escapeHtml(meta.twitterDescription)}" />
          <meta name="twitter:image" content="${escapeHtml(meta.twitterImage)}" />
          <script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>
          <!-- END maumium server-side seo injection -->
        `;
        el.append(metaTags, { html: true });
      }
    })
    .on("title", {
      element(el) {
        el.remove();
      }
    })
    .on('meta[name="description"]', { element(el) { el.remove(); } })
    .on('meta[name="robots"]', { element(el) { el.remove(); } })
    .on('meta[property^="og:"]', { element(el) { el.remove(); } })
    .on('meta[name^="twitter:"]', { element(el) { el.remove(); } })
    .on('link[rel="canonical"]', { element(el) { el.remove(); } })
    .on('script[type="application/ld+json"]', { element(el) { el.remove(); } })
    .on("body", {
      element(el) {
        const summaryHtml = `
          <section data-maumium-seo-summary style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0;">
            <h2>${escapeHtml(meta.title)} - 요약</h2>
            <p>${escapeHtml(meta.crawlableSummary)}</p>
          </section>
        `;
        el.prepend(summaryHtml, { html: true });
      }
    })
    .transform(response);
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
