import { Link } from "wouter";
import { ArrowLeft, FileText, Mail, ShieldCheck } from "lucide-react";
import { SERVICE_COPY } from "@/constants/serviceCopy";
import { LEGAL_COPY } from "@/constants/legalCopy";
import Footer from "@/components/Footer";
import { usePageSeo } from "@/lib/seo";

const CONTACT_EMAIL = SERVICE_COPY.CONTACT_EMAIL;

const terms = [
  {
    title: "서비스 성격",
    body: `${SERVICE_COPY.SERVICE_DESC} 본 서비스는 의료적 진단, 확정 판정, 장애 판정, IQ 판정을 제공하지 않습니다.`,
  },
  {
    title: "비상업적 안내",
    body: "maumium은 현재 결제나 상품 판매를 제공하지 않는 정보 제공형 자가체크 서비스입니다. 사업자등록번호나 대표자명은 사용자가 제공하지 않은 정보를 임의로 표시하지 않습니다.",
  },
  {
    title: "개인정보와 결과 저장",
    body: LEGAL_COPY.PRIVACY_DISCLAIMER,
  },
  {
    title: "이용자 책임",
    body: "사용자는 실명, 전화번호, 주민등록번호 등 직접 식별 가능한 정보를 닉네임이나 문의 내용에 입력하지 않아야 합니다. 결과 해석이 필요하거나 어려움이 지속되면 전문기관의 평가와 상담을 권장합니다.",
  },
 ] as const;

export default function Terms() {
  usePageSeo({
    title: "이용약관 | 마음이음",
    description: "마음이음 서비스 이용약관 및 서비스 제공 범위에 관한 안내입니다.",
    path: "/terms",
    noindex: true,
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container flex items-center h-16 gap-4">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm text-foreground">이용약관</span>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl py-12">
        <div className="mb-10">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-3">이용약관</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            maumium / 마음이음 이용 전 알아야 할 서비스 성격, 개인정보 저장 선택, 문의 방법을 안내합니다.
          </p>
        </div>

        <div className="space-y-6">
          {terms.map(item => (
            <section key={item.title} className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
              <h2 className="text-base font-semibold text-foreground mb-2">{item.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">문의</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            서비스 이용, 개인정보, 협업 관련 문의는 아래 이메일로 연락해 주세요.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex mt-3 text-sm font-semibold text-primary hover:underline">
            {SERVICE_COPY.CONTACT_EMAIL_LABEL}
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
