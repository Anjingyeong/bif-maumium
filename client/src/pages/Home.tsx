/**
 * Home Page - Landing page for BIF Screening
 * Design: Warm Guidance - Editorial + Wellness
 * Deep Navy + Warm Sand + Soft Coral palette
 * Noto Serif KR headings + Pretendard body
 */
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Brain, Heart, BookOpen, ArrowRight, Shield, Users, ClipboardCheck } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663648097828/6VHeQEzjYKHfh7CdssTj54/hero-bg-G22PuoZQMHzrhaaPXVfouj.webp";
const CHILD_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663648097828/6VHeQEzjYKHfh7CdssTj54/child-section-2q9N99eJL9sDbwdufTEuCS.webp";
const ADULT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663648097828/6VHeQEzjYKHfh7CdssTj54/adult-section-Las3h5McrYzSYMVrCZmJEN.webp";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-serif font-semibold text-lg text-foreground">마음이음</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/info" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              경계선 지능이란?
            </Link>
            <Link href="/test/adult">
              <Button variant="outline" size="sm">검사 시작</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
        </div>
        <div className="relative container py-24 md:py-36 lg:py-44">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight mb-6">
              우리 아이, 혹은 나 자신을<br />
              <span className="text-primary">이해하는 첫걸음</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
              경계선 지능은 장애가 아닙니다. 적절한 이해와 지원이 있다면 
              누구나 자신에게 맞는 삶을 살아갈 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/test/adult">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 gap-2">
                  성인 자가진단
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/test/child">
                <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 px-8 gap-2">
                  아동 선별검사
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-serif font-bold text-primary">700만 명</p>
              <p className="text-muted-foreground">국내 경계선 지능 추정 인구</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-serif font-bold text-primary">13.6%</p>
              <p className="text-muted-foreground">전체 인구 대비 비율</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-serif font-bold text-primary">IQ 71~84</p>
              <p className="text-muted-foreground">경계선 지능 범위</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Test Cards Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
              간편 선별검사
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              약 5~10분 소요되는 간단한 체크리스트로 경계선 지능의 가능성을 확인해보세요.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Adult Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link href="/test/adult">
                <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={ADULT_IMG}
                      alt="성인 자가진단"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-primary">만 18세 이상</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-foreground mb-2">성인 자가진단</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      본인의 인지 능력, 학습 패턴, 사회적 적응력을 스스로 점검해보는 15문항 체크리스트입니다.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary font-medium group-hover:gap-3 transition-all">
                      검사 시작하기 <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Child Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/test/child">
                <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={CHILD_IMG}
                      alt="아동 선별검사"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-5 h-5 text-accent" />
                      <span className="text-sm font-medium text-accent">만 5세 ~ 15세</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-foreground mb-2">아동 선별검사 (학부모용)</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      자녀의 발달, 학습, 사회성을 관찰하여 응답하는 18문항 학부모용 체크리스트입니다.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-accent font-medium group-hover:gap-3 transition-all">
                      검사 시작하기 <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
              안전하고 신뢰할 수 있는 검사
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center space-y-3"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-foreground">개인정보 보호</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                모든 응답은 브라우저에서만 처리되며 서버에 저장되지 않습니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center space-y-3"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                <ClipboardCheck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-foreground">근거 기반 문항</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                교육부 및 전문기관의 선별 기준을 참고하여 구성된 체크리스트입니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center space-y-3"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-foreground">전문기관 연계</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                결과에 따라 적절한 전문기관과 지원 서비스를 안내해드립니다.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <BookOpen className="w-10 h-10 text-primary mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
              이해는 변화의 시작입니다
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              경계선 지능은 적절한 지원과 환경이 갖춰진다면 충분히 극복할 수 있습니다.
              먼저 현재 상태를 이해하는 것에서 시작해보세요.
            </p>
            <Link href="/info">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
                경계선 지능에 대해 더 알아보기
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border/50 bg-secondary/20">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              <span className="font-serif font-medium text-foreground">마음이음</span>
            </div>
            <p className="text-xs text-muted-foreground text-center md:text-right max-w-md">
              본 서비스는 의학적 진단을 대체하지 않습니다. 정확한 진단은 반드시 전문기관을 통해 받으시기 바랍니다.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
