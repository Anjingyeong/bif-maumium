import { Link } from "wouter";
import { ArrowLeft, HelpCircle } from "lucide-react";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import {
  FAQ_DESCRIPTION,
  FAQ_ITEMS,
  breadcrumbJsonLd,
  faqJsonLd,
  usePageSeo,
} from "@/lib/seo";

export default function Faq() {
  usePageSeo({
    title: "자주 묻는 질문 | 마음이음",
    description: FAQ_DESCRIPTION,
    path: "/faq",
  });

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={faqJsonLd(FAQ_ITEMS)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", path: "/" },
          { name: "자주 묻는 질문", path: "/faq" },
        ])}
      />
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/50">
        <div className="container flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">홈으로</span>
          </Link>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">FAQ</span>
          </div>
          <div />
        </div>
      </header>

      <main className="container max-w-3xl py-10 md:py-16">
        <div className="mb-10">
          <p className="text-sm font-medium text-primary mb-3">마음이음 안내</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            자주 묻는 질문
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            마음이음 자가체크를 시작하기 전에 많이 묻는 질문과 답변을 정리했습니다.
          </p>
        </div>

        <dl className="space-y-4">
          {FAQ_ITEMS.map((item) => (
            <div key={item.question} className="rounded-xl border border-border/60 bg-card p-5">
              <dt className="font-serif text-lg font-bold text-foreground mb-2">
                {item.question}
              </dt>
              <dd className="text-sm text-muted-foreground leading-relaxed">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </main>
      <Footer />
    </div>
  );
}
