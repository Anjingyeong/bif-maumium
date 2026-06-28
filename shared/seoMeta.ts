export const SITE_URL = "https://maumium.pages.dev";
export const SITE_NAME = "maumium";
export const SITE_NAME_KO = "마음이음";
export const CONTACT_EMAIL = "maumium.service@gmail.com";

export interface SeoMeta {
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  jsonLd: Record<string, any>;
  crawlableSummary: string;
}

export const NAVER_DESC_MAX = 80;

export function naverClamp(text: string, max = NAVER_DESC_MAX): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}

interface SeoBlogPost {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
}

// Blog posts slugs and titles from client/src/lib/blogData.ts
export const SEO_BLOG_POSTS: SeoBlogPost[] = [
  {
    title: "경계선 지능이란? 증상과 특징 완전 정리",
    slug: "what-is-borderline-intelligence",
    description: "경계선 지능(BIF)의 정의, 주요 특징, 학습 및 인지 어려움 수준을 정리했습니다.",
    publishedAt: "2026-05-01",
  },
  {
    title: "우리 아이 경계선 지능 의심될 때 — 부모가 알아야 할 5가지",
    slug: "child-borderline-intelligence-parents-guide",
    description: "아동의 학습 지체, 인지·적응 어려움이 의심될 때 부모를 위한 핵심 안내서입니다.",
    publishedAt: "2026-05-05",
  },
  {
    title: "성인 경계선 지능 자가체크 - 나도 해당될까?",
    slug: "adult-borderline-intelligence-self-check",
    description: "성인기 직장, 사회적 적응, 인지 처리 속도 등 일상에서 관찰되는 특징을 짚어봅니다.",
    publishedAt: "2026-05-08",
  },
  {
    title: "경계선 지능 지원 제도 총정리 (2026년 최신)",
    slug: "borderline-intelligence-support-2026",
    description: "기초학력 보장, 지역 평생교육지원센터 등 경계선 지능인을 위한 지원 제도를 정리했습니다.",
    publishedAt: "2026-05-10",
  },
];

export function getSeoMeta(path: string): SeoMeta | null {
  const cleanPath = "/" + path.replace(/^\/+/, "").split("?")[0].split("#")[0];

  const defaults = {
    ogType: "website",
    ogImage: `${SITE_URL}/og-image.png`,
    twitterCard: "summary_large_image",
    twitterImage: `${SITE_URL}/og-image.png`,
  };

  // 1. Check Blog Posts
  if (cleanPath.startsWith("/blog/")) {
    const slug = cleanPath.substring(6);
    const post = SEO_BLOG_POSTS.find((p) => p.slug === slug);
    if (post) {
      const title = `${post.title} | ${SITE_NAME_KO}`;
      const description = naverClamp(post.description);
      const canonical = `${SITE_URL}/blog/${post.slug}`;
      return {
        path: cleanPath,
        title,
        description,
        canonical,
        ogTitle: title,
        ogDescription: description,
        twitterTitle: title,
        twitterDescription: description,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.description,
          "datePublished": post.publishedAt,
          "author": {
            "@type": "Organization",
            "name": SITE_NAME_KO,
            "url": SITE_URL,
          },
          "publisher": {
            "@type": "Organization",
            "name": SITE_NAME_KO,
            "logo": {
              "@type": "ImageObject",
              "url": `${SITE_URL}/icons/maumium-icon-512.png`,
            },
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonical,
          },
        },
        crawlableSummary: `마음이음 정보 센터 아티클: "${post.title}". ${post.description} 경계선 지능 및 느린학습자 상태에 대한 이해를 돕기 위한 교육용 정보 자료입니다.`,
        ...defaults,
      };
    }
    return null;
  }

  // 2. Check Static Paths
  switch (cleanPath) {
    case "/": {
      const title = "느린학습자·경계선 지능 자가체크 테스트 | 마음이음";
      const desc = naverClamp("느린학습자·경계선 지능 가능성을 온라인 문항으로 점검해 보세요.");
      return {
        path: cleanPath,
        title,
        description: desc,
        canonical: `${SITE_URL}/`,
        ogTitle: title,
        ogDescription: desc,
        twitterTitle: title,
        twitterDescription: desc,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": SITE_NAME_KO,
          "alternateName": "느린학습자·경계선 지능 자가체크",
          "url": SITE_URL,
          "inLanguage": "ko-KR",
        },
        crawlableSummary: "maumium은 경계선 지능 가능성, 느린학습자, 학습·인지·적응 어려움을 살펴보기 위한 선별용 자가체크 서비스입니다.",
        ...defaults,
      };
    }

    case "/info": {
      const title = "경계선 지능이란 무엇인가요? | 마음이음";
      const desc = naverClamp("지적장애와 평균 지능 사이에 위치하는 인지 능력 수준인 경계선 지능(BIF)의 정의와 주요 특징을 설명합니다.");
      return {
        path: cleanPath,
        title,
        description: desc,
        canonical: `${SITE_URL}/info`,
        ogTitle: title,
        ogDescription: desc,
        twitterTitle: title,
        twitterDescription: desc,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title,
          "description": desc,
          "url": `${SITE_URL}/info`,
        },
        crawlableSummary: "maumium 경계선 지능 정보 안내: 경계선 지능(Borderline Intellectual Functioning)은 지적장애와 평균 지능 사이의 인지 수준을 의미하며, 학습 속도가 느리고 복잡한 사회적 상황에서 지원이 필요할 수 있습니다.",
        ...defaults,
      };
    }

    case "/blog": {
      const title = "경계선 지능 정보 센터 | 마음이음";
      const desc = naverClamp("경계선 지능(BIF) 자가체크, 증상 정보, 부모 가이드, 지원 제도 등 신뢰할 수 있는 정보를 제공합니다.");
      return {
        path: cleanPath,
        title,
        description: desc,
        canonical: `${SITE_URL}/blog`,
        ogTitle: title,
        ogDescription: desc,
        twitterTitle: title,
        twitterDescription: desc,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title,
          "description": desc,
          "url": `${SITE_URL}/blog`,
        },
        crawlableSummary: "maumium 블로그 정보 센터에서는 경계선 지능 및 느린학습자 아동/성인의 인지기능 특징, 부모 대응 방안, 복지 및 기초학력 지원 정책 등을 아우르는 유용한 칼럼을 모아 제공합니다.",
        ...defaults,
      };
    }

    case "/privacy": {
      const title = "개인정보처리방침 | 마음이음";
      const desc = naverClamp("마음이음 서비스의 개인정보 수집, 이용, 보관 정책에 관한 안내입니다.");
      return {
        path: cleanPath,
        title,
        description: desc,
        canonical: `${SITE_URL}/privacy`,
        ogTitle: title,
        ogDescription: desc,
        twitterTitle: title,
        twitterDescription: desc,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title,
          "description": desc,
          "url": `${SITE_URL}/privacy`,
        },
        crawlableSummary: "maumium 개인정보처리방침은 수집 항목, 처리 목적, 보유 기간, 제3자 제공 여부, 문의 방법을 안내합니다.",
        ...defaults,
      };
    }

    case "/terms": {
      const title = "이용약관 | 마음이음";
      const desc = naverClamp("마음이음 서비스 이용약관 및 서비스 제공 범위에 관한 안내입니다.");
      return {
        path: cleanPath,
        title,
        description: desc,
        canonical: `${SITE_URL}/terms`,
        ogTitle: title,
        ogDescription: desc,
        twitterTitle: title,
        twitterDescription: desc,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title,
          "description": desc,
          "url": `${SITE_URL}/terms`,
        },
        crawlableSummary: "maumium 이용약관은 서비스 성격, 진단이 아닌 선별용 자가체크 안내, 이용 시 주의사항을 제공합니다.",
        ...defaults,
      };
    }

    case "/faq": {
      const title = "자주 묻는 질문 | 마음이음";
      const desc = naverClamp("마음이음 자가체크와 경계선 지능 상담 전 확인할 질문을 정리했습니다.");
      return {
        path: cleanPath,
        title,
        description: desc,
        canonical: `${SITE_URL}/faq`,
        ogTitle: title,
        ogDescription: desc,
        twitterTitle: title,
        twitterDescription: desc,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title,
          "description": desc,
          "url": `${SITE_URL}/faq`,
        },
        crawlableSummary: "maumium 자주 묻는 질문에서는 경계선 지능 가능성 자가체크, 느린학습자 특성, 결과 해석, 개인정보 처리와 관련된 안내를 제공합니다.",
        ...defaults,
      };
    }

    // Keyword Landing pages
    case "/slow-learner-test":
    case "/borderline-iq-test":
    case "/slow-learner-checklist":
    case "/slow-learner-vs-borderline-iq": {
      const titles: Record<string, string> = {
        "/slow-learner-test": "느린학습자 테스트 | 자가체크 체크리스트",
        "/borderline-iq-test": "경계선 지능 자가체크 테스트 | 마음이음",
        "/slow-learner-checklist": "느린학습자 체크리스트 | 특징과 자가체크",
        "/slow-learner-vs-borderline-iq": "느린학습자와 경계선 지능 차이",
      };
      const descs: Record<string, string> = {
        "/slow-learner-test": "느린학습자 특성과 학습·적응 어려움을 자가체크로 살펴보세요.",
        "/borderline-iq-test": "경계선 지능 가능성과 적응기능 어려움을 온라인 문항으로 점검하세요.",
        "/slow-learner-checklist": "느린학습자 특징과 지원이 필요한 영역을 체크리스트로 확인하세요.",
        "/slow-learner-vs-borderline-iq": "느린학습자와 경계선 지능 표현의 차이를 쉽게 정리했습니다.",
      };
      const title = titles[cleanPath];
      const desc = naverClamp(descs[cleanPath]);
      return {
        path: cleanPath,
        title,
        description: desc,
        canonical: `${SITE_URL}${cleanPath}`,
        ogTitle: title,
        ogDescription: desc,
        twitterTitle: title,
        twitterDescription: desc,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title,
          "description": desc,
          "url": `${SITE_URL}${cleanPath}`,
        },
        crawlableSummary: `maumium 키워드 상세 안내 페이지: ${title}. ${desc} 이 선별검사 도구는 참고 자료일 뿐 의학적 판단을 대체할 수 없으므로 주의하시기 바랍니다.`,
        ...defaults,
      };
    }

    default:
      return null;
  }
}
