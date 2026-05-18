/**
 * Privacy Policy Page - 개인정보처리방침
 * 마음이음 서비스의 개인정보 수집/이용/보관 정책 안내
 */
import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, Mail, Lock, Trash2, Eye, AlertCircle } from "lucide-react";

const LAST_UPDATED = "2026년 5월 12일";
const SERVICE_NAME = "마음이음";
const CONTACT_EMAIL = "maumium.service@gmail.com";

const sections = [
  {
    id: "overview",
    title: "1. 개요",
    icon: <Shield className="w-5 h-5" />,
    content: `${SERVICE_NAME}(이하 "서비스")는 경계선 지능 가능성 자가체크와 학습·인지·적응기능 선별 정보를 제공하는 웹 서비스입니다. 본 방침은 서비스 이용 과정에서 수집되는 정보의 처리 방법을 안내합니다.

본 서비스는 사용자의 개인정보 보호를 최우선으로 하며, 가능한 한 최소한의 정보만 수집합니다. 현재 서비스는 별도의 서버 없이 사용자의 기기(브라우저) 내에서만 데이터를 처리합니다.`,
  },
  {
    id: "collect",
    title: "2. 수집하는 정보",
    icon: <Eye className="w-5 h-5" />,
    content: `서비스는 다음과 같이 최소한의 정보만 수집합니다.

■ 자동 수집 정보 (서버 미전송)
- 검사 응답 데이터: 자가체크 문항에 대한 응답값 및 점수
- 검사 이력: 검사 일시, 검사 유형(성인/아동), 총점
- 동의 기록: 면책 고지 및 데이터 수집 동의 여부
- 피드백: 서비스 만족도 평가 및 코멘트

■ 선택적 수집 정보 (서버 미전송)
- 이메일 주소: 전문가 자문 서비스 오픈 알림 신청 시 (선택 사항)

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
    content: `■ 저장 위치: 사용자의 기기 내 브라우저 로컬스토리지(localStorage)
■ 외부 전송: 수집된 모든 정보는 외부 서버로 전송되지 않습니다.
■ 저장 기간: 사용자가 직접 삭제하거나 브라우저 데이터를 초기화할 때까지 보관됩니다.
■ 암호화: 브라우저 로컬스토리지에 저장되며, 별도의 암호화는 적용되지 않습니다.

※ 향후 서버 기반 서비스(회원가입, 유료 기능 등)가 추가될 경우 본 방침을 개정하여 사전에 안내드립니다.`,
  },
  {
    id: "purpose",
    title: "4. 정보 이용 목적",
    icon: <AlertCircle className="w-5 h-5" />,
    content: `수집된 정보는 다음 목적으로만 이용됩니다.

- 검사 결과 표시 및 이전 결과와의 비교 분석
- 검사 이력 조회 및 점수 추이 시각화
- 전문가 자문 서비스 오픈 시 이메일 알림 발송 (이메일 등록자에 한함)
- 서비스 품질 개선을 위한 익명 통계 분석 (동의자에 한함)

수집된 정보는 제3자에게 제공, 판매, 공유되지 않습니다.`,
  },
  {
    id: "rights",
    title: "5. 사용자 권리",
    icon: <Trash2 className="w-5 h-5" />,
    content: `사용자는 언제든지 다음 방법으로 저장된 정보를 삭제할 수 있습니다.

■ 검사 이력 삭제
- "내 기록" 페이지 → "전체 기록 삭제" 버튼 클릭

■ 이메일 등록 취소
- 브라우저 개발자 도구 → Application → Local Storage → 'bif_notify_email' 항목 삭제
- 또는 브라우저 설정에서 사이트 데이터 전체 삭제

■ 모든 데이터 삭제
- 브라우저 설정 → 개인정보 및 보안 → 인터넷 사용 기록 삭제 → 쿠키 및 사이트 데이터 삭제

개인정보 관련 문의 또는 삭제 요청은 아래 연락처로 문의해 주세요.`,
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

■ 방문자 분석: 서비스 개선을 위해 익명 방문자 통계(페이지뷰, 방문 횟수)를 수집할 수 있습니다. 이 데이터는 개인을 식별하지 않으며, 개인정보와 연결되지 않습니다.

■ 외부 서비스: 카카오 공유 기능 이용 시 카카오의 개인정보처리방침이 적용됩니다.`,
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
              { icon: "🔒", title: "서버 미전송", desc: "모든 데이터는 기기 내에만 저장" },
              { icon: "🚫", title: "개인정보 미수집", desc: "이름·전화번호 등 수집 안 함" },
              { icon: "🗑️", title: "언제든 삭제 가능", desc: "내 기록 페이지에서 즉시 삭제" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 목차 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 bg-secondary/40 rounded-xl p-5"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">목차</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
              >
                {s.title}
              </a>
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
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
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
      <footer className="border-t border-border/50 py-6 mt-8">
        <div className="container text-center text-xs text-muted-foreground">
          <p>© 2026 {SERVICE_NAME}. 본 서비스는 진단 도구가 아니라 선별용 자가체크입니다.</p>
          <p className="mt-1">
            <Link href="/privacy" onClick={scrollToTop} className="hover:text-foreground transition-colors underline underline-offset-2">
              개인정보처리방침
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
