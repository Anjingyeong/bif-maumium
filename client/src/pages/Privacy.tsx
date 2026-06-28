/**
 * Privacy Policy Page - 개인정보처리방침
 * 마음이음 서비스의 개인정보 수집/이용/보관 정책 안내
 */
import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, Mail, Lock, Trash2, Eye, AlertCircle, Database, Ban } from "lucide-react";
import { SERVICE_COPY } from "@/constants/serviceCopy";
import { LEGAL_COPY } from "@/constants/legalCopy";
import Footer from "@/components/Footer";
import { usePageSeo } from "@/lib/seo";

const LAST_UPDATED = "2026년 6월 27일";
const SERVICE_NAME = SERVICE_COPY.SERVICE_NAME_KO;
const SERVICE_NAME_EN = SERVICE_COPY.SERVICE_NAME_EN;
const CONTACT_EMAIL = SERVICE_COPY.CONTACT_EMAIL;

const sections = [
  {
    id: "overview",
    title: "1. 개요",
    icon: <Shield className="w-5 h-5" />,
    content: `${SERVICE_COPY.SERVICE_DESC} 본 방침은 서비스 이용 과정에서 수집되는 정보의 처리 방법을 안내합니다.

본 서비스는 의료적 진단, 확정 판정, 장애 판정, IQ 판정을 제공하지 않습니다. 개인정보와 검사 결과는 최소수집 원칙에 따라 처리하며, 결과 저장은 사용자가 명시적으로 동의한 경우에만 이루어집니다.`,
  },
  {
    id: "collect",
    title: "2. 수집하는 정보",
    icon: <Eye className="w-5 h-5" />,
    content: `서비스는 다음과 같이 최소한의 정보만 수집합니다.

■ 브라우저에 저장될 수 있는 정보
- 동의 설정: 익명 통계 활용 동의 여부
- 일시 세션 정보: 검사 시작 안내 확인 여부
- 화면 설정: 테마, 관리자 화면 폭 같은 비민감 UI 설정

■ 결과 저장 동의 시 서버에 저장될 수 있는 정보
- 닉네임 또는 표시 이름
- 선택 입력 이메일 주소
- 검사 유형(test_type)
- 위험도 수준(risk_level)
- 결과 식별자(result_id 또는 id)
- 제출 시각(created_at)
- 문항 응답, 영역별 점수, 총점, 최대 점수

■ 문의 시 수집될 수 있는 정보
- 문의 이메일 주소
- 문의 내용

■ 수집하지 않는 정보
- 이름, 생년월일, 주소, 전화번호 등 신원 식별 정보
- 의료 기록, 진단 정보
- 결제 정보
- 위치 정보`,
  },
  {
    id: "storage",
    title: "3. 정보 저장 방식",
    icon: <Lock className="w-5 h-5" />,
    content: `■ 브라우저 저장: 검사 응답, 점수, 닉네임, 결과 식별자, 피드백 코멘트는 로컬스토리지(localStorage)에 저장하지 않습니다.
■ 허용되는 브라우저 저장: 익명 통계 활용 동의 여부, 세션 단위 안내 확인 여부, 비민감 화면 설정만 저장될 수 있습니다.
■ 서버 저장: 사용자가 결과 저장에 동의한 경우에만 Worker API를 통해 결과 데이터가 저장됩니다.
■ 저장 기간: 목적 달성 또는 삭제 요청 시 파기합니다. 익명 통계 데이터는 서비스 개선 목적 범위에서 보관될 수 있습니다.

※ 향후 회원가입, 결제, 유료 기능 등 개인정보 처리 범위가 달라지는 기능이 추가될 경우 본 방침을 개정하여 사전에 안내드립니다.`,
  },
  {
    id: "purpose",
    title: "4. 정보 이용 목적",
    icon: <AlertCircle className="w-5 h-5" />,
    content: `수집된 정보는 다음 목적으로만 이용됩니다.

- 자가체크 결과 제공
- 문의 응대
- 오류 확인 및 서비스 안정성 개선
- 익명 통계 분석 및 서비스 개선 (동의자에 한함)

수집된 정보는 법령상 필요한 경우를 제외하고 제3자에게 제공, 판매, 공유되지 않습니다.`,
  },
  {
    id: "rights",
    title: "5. 사용자 권리",
    icon: <Trash2 className="w-5 h-5" />,
    content: `사용자는 언제든지 다음 방법으로 저장된 정보를 삭제할 수 있습니다.

■ 서버 저장 결과 삭제 요청
- 결과 식별자 또는 저장 당시 닉네임 등 확인 가능한 정보를 포함해 문의 이메일로 요청

■ 모든 데이터 삭제
- 브라우저 설정 → 개인정보 및 보안 → 인터넷 사용 기록 삭제 → 쿠키 및 사이트 데이터 삭제

사용자는 개인정보 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다. 개인정보 관련 문의 또는 삭제 요청은 아래 연락처로 문의해 주세요.`,
  },
  {
    id: "disclaimer",
    title: "6. 의료 면책 고지",
    icon: <AlertCircle className="w-5 h-5" />,
    content: `본 서비스의 자가체크 결과는 진단 도구가 아니라 선별용 참고 자료입니다.

- 본 검사는 학습·인지·적응기능 어려움과 경계선 지능 가능성을 살펴보기 위한 선별용 참고 도구입니다.
- 검사 결과는 표준화 지능검사(K-WAIS, K-WISC 등), 적응행동검사(Vineland, ABAS, NISE-K·ABS 등), 면담을 대체할 수 없습니다.
- 검사 결과에 관계없이 전문가 상담이 필요하다고 느끼시면 정신건강의학과 또는 임상심리사를 방문하시기 바랍니다.
- 본 서비스는 의료기기가 아니며, 의료법상 의료행위에 해당하지 않습니다.`,
  },
  {
    id: "cookies",
    title: "7. 쿠키 및 분석 도구",
    icon: <Eye className="w-5 h-5" />,
    content: `■ 쿠키: 본 서비스는 필수 기능 외 쿠키를 사용하지 않습니다.

■ 추적 도구: 현재 Google Analytics, Google Tag Manager, Microsoft Clarity 같은 별도의 광고·행태 추적 도구를 사용하지 않습니다.

■ 분석 동의: 향후 방문자 분석 도구를 도입하는 경우, 필요한 경우 동의 전에는 분석 스크립트를 로드하지 않고 본 방침에 도구명과 목적을 반영하겠습니다.`,
  },
  {
    id: "changes",
    title: "8. 방침 변경 안내",
    icon: <AlertCircle className="w-5 h-5" />,
    content: `본 개인정보처리방침은 서비스 변경에 따라 업데이트될 수 있습니다. 중요한 변경 사항이 있을 경우 서비스 내 공지 또는 이메일(등록자에 한함)을 통해 사전에 안내드립니다.

최종 수정일: ${LAST_UPDATED}`,
  },
];

export default function Privacy() {
  usePageSeo({
    title: "개인정보처리방침 | 마음이음",
    description: "마음이음 서비스의 개인정보 수집, 이용, 보관 정책에 관한 안내입니다.",
    path: "/privacy",
    noindex: true,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 간단한 헤더 */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container flex items-center h-16 gap-4">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm text-foreground">개인정보처리방침</span>
          </div>
        </div>
      </header>

      <main className="container py-12 max-w-3xl mx-auto">
        {/* 페이지 타이틀 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">개인정보처리방침</h1>
              <p className="text-sm text-muted-foreground mt-0.5">최종 수정일: {LAST_UPDATED}</p>
            </div>
          </div>

          {/* 핵심 요약 배너 */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: <Lock className="w-5 h-5 text-primary" />, title: "최소수집", desc: "결과 저장은 동의한 경우에만 처리" },
              { icon: <Ban className="w-5 h-5 text-primary" />, title: "직접 식별정보 지양", desc: "실명·전화번호 등 입력 금지" },
              { icon: <Database className="w-5 h-5 text-primary" />, title: "삭제 요청 가능", desc: "문의 이메일로 열람·삭제 요청" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 본문 섹션들 */}
        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
              className="scroll-mt-20"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  {section.icon}
                </div>
                <h2 className="text-base font-semibold text-foreground">{section.title}</h2>
              </div>
              <div className="pl-10">
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
              {i < sections.length - 1 && (
                <div className="mt-8 border-t border-border/50" />
              )}
            </motion.section>
          ))}
        </div>

        {/* 문의처 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-10 bg-secondary/40 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">개인정보 관련 문의</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            개인정보 처리에 관한 문의, 열람·정정·삭제 요청은 아래 이메일로 연락해 주세요.
            영업일 기준 3일 이내 답변드립니다.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-primary hover:underline"
          >
            <Mail className="w-4 h-4" />
            {CONTACT_EMAIL}
          </a>
        </motion.div>

        {/* 하단 홈 링크 */}
        <div className="mt-10 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            마음이음 홈으로 돌아가기
          </Link>
        </div>
      </main>

      {/* 푸터에 개인정보처리방침 링크 */}
      <Footer />
    </div>
  );
}
