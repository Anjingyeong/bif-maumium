import { Link } from "wouter";
import { Brain } from "lucide-react";
import { SERVICE_COPY } from "@/constants/serviceCopy";
import { LEGAL_COPY } from "@/constants/legalCopy";

export default function Footer() {
  return (
    <footer className="py-10 border-t border-border/50 bg-secondary/20 mt-12 w-full">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-serif font-semibold text-foreground">
              {SERVICE_COPY.SERVICE_NAME_KO}
            </span>
          </div>

          <div className="text-xs text-muted-foreground space-y-1.5 max-w-md md:max-w-xl">
            <p>{LEGAL_COPY.PRE_TEST_DISCLAIMER}</p>
            <p>
              비상업적 안내: {SERVICE_COPY.SERVICE_NAME_EN}은 현재 결제나 상품 판매를 제공하지 않는 정보 제공형 자가체크 서비스입니다.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <Link href="/info" className="hover:text-foreground transition-colors">
              경계선 지능이란?
            </Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">
              정보 센터
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors font-medium text-foreground underline decoration-primary/40 underline-offset-4">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors font-medium text-foreground underline decoration-primary/40 underline-offset-4">
              이용약관
            </Link>
            <a
              href={`mailto:${SERVICE_COPY.CONTACT_EMAIL}`}
              className="hover:text-foreground transition-colors font-medium"
            >
              {SERVICE_COPY.CONTACT_EMAIL_LABEL}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
