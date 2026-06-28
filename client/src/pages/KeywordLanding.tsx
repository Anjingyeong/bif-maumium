import { Link, useLocation } from "wouter";
import { ArrowRight, Brain, CheckCircle2 } from "lucide-react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { LEGAL_COPY } from "@/constants/legalCopy";
import { SERVICE_COPY } from "@/constants/serviceCopy";
import { usePageSeo } from "@/lib/seo";

type LandingPage = {
  readonly title: string;
  readonly h1: string;
  readonly lead: string;
  readonly description: string;
  readonly keywords: readonly string[];
};

const PAGES: Record<string, LandingPage> = {
  "/slow-learner-test": {
    title: "느린학습자 테스트 | 자가체크 체크리스트",
    h1: "느린학습자 테스트",
    lead: "느린학습자 특성과 일상 속 학습·인지·적응 어려움을 간단한 문항으로 살펴보는 참고용 자가체크 페이지입니다.",
    description: "느린학습자 특성과 학습·적응 어려움을 자가체크로 살펴보세요.",
    keywords: ["느린학습자 테스트", "느린학습자 자가체크", "느린학습자 체크리스트"],
  },
  "/borderline-iq-test": {
    title: `경계선 지능 자가체크 테스트 | ${SERVICE_COPY.SERVICE_NAME_KO}`,
    h1: "경계선 지능 자가체크 테스트",
    lead: "경계선 지능 가능성과 관련된 학습·인지·적응기능 어려움을 온라인 문항으로 점검해볼 수 있습니다.",
    description: "경계선 지능 가능성과 적응기능 어려움을 온라인 문항으로 점검하세요.",
    keywords: ["경계선 지능 테스트", "경계선 지능 자가체크", "경계선 지능 체크리스트"],
  },
  "/slow-learner-checklist": {
    title: "느린학습자 체크리스트 | 특징과 자가체크",
    h1: "느린학습자 체크리스트",
    lead: "최근 생활 경험을 기준으로 느린학습자 특성과 지원이 필요한 영역을 차분히 확인해보는 체크리스트입니다.",
    description: "느린학습자 특징과 지원이 필요한 영역을 체크리스트로 확인하세요.",
    keywords: ["느린학습자 체크리스트", "느린학습자 테스트", "느린학습자 자가체크"],
  },
  "/slow-learner-vs-borderline-iq": {
    title: "느린학습자와 경계선 지능 차이",
    h1: "느린학습자와 경계선 지능 차이",
    lead: "느린학습자와 경계선 지능이라는 표현이 어떤 맥락에서 쓰이는지, 참고용 자가체크 전 알아두면 좋은 차이를 정리했습니다.",
    description: "느린학습자와 경계선 지능 표현의 차이를 쉽게 정리했습니다.",
    keywords: ["느린학습자", "경계선 지능", "경계선 지능 자가체크"],
  },
};

export default function KeywordLanding() {
  const [location, navigate] = useLocation();
  const page = PAGES[location] ?? PAGES["/slow-learner-test"];

  usePageSeo({
    title: page.title,
    description: page.description,
    path: location === "/" ? "/" : `/${location.replace(/^\/+/, "")}`,
  });

  return (
    <div className="min-h-screen bg-background">
      <NavBar onStartTest={() => navigate("/")} />
      <main className="pt-24 pb-16">
        <section className="container">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-primary mb-5">
              <Brain className="w-5 h-5" />
              <span className="text-sm font-medium">{SERVICE_COPY.SERVICE_NAME_KO} 참고용 자가체크</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-tight mb-5">
              {page.h1}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
              {page.lead} {LEGAL_COPY.PRE_TEST_DISCLAIMER}
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {page.keywords.map(keyword => (
                <span
                  key={keyword}
                  className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground"
                >
                  {keyword}
                </span>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-card p-5 md:p-6 mb-8">
              <h2 className="text-lg font-serif font-bold text-foreground mb-4">
                시작 전 확인해 주세요
              </h2>
              <ul className="space-y-3">
                {[
                  LEGAL_COPY.PRE_TEST_DISCLAIMER,
                  "응답은 최근 6개월~1년의 실제 생활 경험을 기준으로 선택해 주세요.",
                ].map(item => (
                  <li key={item} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/test/adult">
                <Button className="w-full sm:w-auto gap-2">
                  나를 위한 자가체크 <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/test/child">
                <Button variant="outline" className="w-full sm:w-auto gap-2">
                  자녀를 위한 보호자 체크 <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
