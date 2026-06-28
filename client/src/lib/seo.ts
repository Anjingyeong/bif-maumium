import { useEffect } from "react";

export const SITE_URL = "https://maumium.pages.dev" as const;
export const SITE_NAME = "마음이음" as const;
export const DEFAULT_TITLE = "느린학습자·경계선 지능 자가체크 | 마음이음" as const;
export const HOME_DESCRIPTION =
  "느린학습자·경계선 지능 가능성을 온라인 문항으로 점검해 보세요." as const;
export const FAQ_DESCRIPTION =
  "마음이음 자가체크와 경계선 지능 상담 전 확인할 질문을 정리했습니다." as const;
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png` as const;
export const NAVER_DESC_MAX = 80;

export type SeoMeta = {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly noindex?: boolean;
};

export type FaqItem = {
  readonly question: string;
  readonly answer: string;
};

export const FAQ_ITEMS = [
  {
    question: "마음이음 자가체크는 어떤 서비스인가요?",
    answer:
      "느린학습자와 경계선 지능 가능성을 생활 문항으로 살펴보는 참고용 온라인 자가체크입니다.",
  },
  {
    question: "자가체크 결과만으로 진단할 수 있나요?",
    answer:
      "아니요. 결과는 참고용이며 정확한 평가는 정신건강의학과, 발달센터, 상담기관의 전문 검사가 필요합니다.",
  },
  {
    question: "성인과 아동 모두 사용할 수 있나요?",
    answer:
      "성인은 본인용 자가체크를, 보호자는 자녀 관찰용 체크를 선택해 최근 생활 모습을 기준으로 응답할 수 있습니다.",
  },
  {
    question: "결과를 검색엔진이나 다른 사람에게 공개하나요?",
    answer:
      "검사 응답은 브라우저와 선택한 저장 기능을 중심으로 다루며, 공개 검색 페이지에 개인 결과를 노출하지 않습니다.",
  },
] as const satisfies readonly FaqItem[];

export function naverClamp(text: string, max = NAVER_DESC_MAX): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}

export function canonicalUrl(path: SeoMeta["path"]): string {
  const normalizedPath = path === "/" ? "/" : `/${path.replace(/^\/+/, "")}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function setPageSeo(meta: SeoMeta): void {
  const shortDescription = naverClamp(meta.description);
  const url = canonicalUrl(meta.path);

  document.title = meta.title;
  setMeta("description", shortDescription);
  setMeta("robots", meta.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
  setProperty("og:title", meta.title);
  setProperty("og:description", shortDescription);
  setProperty("og:url", url);
  setMeta("twitter:title", meta.title);
  setMeta("twitter:description", shortDescription);
  setCanonical(url);
}

export function usePageSeo(meta: SeoMeta): void {
  useEffect(() => {
    setPageSeo(meta);
  }, [meta.title, meta.description, meta.path, meta.noindex]);
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "느린학습자·경계선 지능 자가체크",
    url: SITE_URL,
    inLanguage: "ko-KR",
  };
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/maumium-icon-512.png`,
  };
}

export function faqJsonLd(items: readonly FaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(
  items: readonly { readonly name: string; readonly path: SeoMeta["path"] }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

function setMeta(name: string, content: string): void {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setProperty(property: string, content: string): void {
  let tag = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setCanonical(href: string): void {
  let tag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.rel = "canonical";
    document.head.appendChild(tag);
  }
  tag.href = href;
}
