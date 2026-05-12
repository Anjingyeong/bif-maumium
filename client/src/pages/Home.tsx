/**
 * Home Page - Landing page for BIF Screening
 * Design: Warm Guidance - Editorial + Wellness
 * Deep Navy + Warm Sand + Soft Coral palette
 * Noto Serif KR headings + Pretendard body
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Brain, Heart, BookOpen, ArrowRight, Shield, Users, ClipboardCheck, Newspaper, History as HistoryIcon } from "lucide-react";
import ConsentModal from "@/components/ConsentModal";
import EmailNotifyWidget from "@/components/EmailNotifyWidget";
import { getConsentGiven, setConsentGiven } from "@/lib/history";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663648097828/6VHeQEzjYKHfh7CdssTj54/hero-bg-G22PuoZQMHzrhaaPXVfouj.webp";
const CHILD_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663648097828/6VHeQEzjYKHfh7CdssTj54/child-section-2q9N99eJL9sDbwdufTEuCS.webp";
const ADULT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663648097828/6VHeQEzjYKHfh7CdssTj54/adult-section-Las3h5McrYzSYMVrCZmJEN.webp";

export default function Home() {
  const [, navigate] = useLocation();
  const [consentOpen, setConsentOpen] = useState(false);
  const [pendingTestType, setPendingTestType] = useState<"adult" | "child">("adult");

  const openConsent = (type: "adult" | "child") => {
    setPendingTestType(type);
    // 이미 동의한 경우 모달 건너뜀 (localStorage에 기록됨)
    if (getConsentGiven()) {
      navigate(type === "adult" ? "/test/adult" : "/test/child");
    } else {
      setConsentOpen(true);
    }
  };

  const handleConsentAccept = (allowDataCollection: boolean) => {
    setConsentOpen(false);
    // localStorage에 저장 - 브라우저를 닫아도 기억됨
    setConsentGiven(allowDataCollection);
    navigate(pendingTestType === "adult" ? "/test/adult" : "/test/child");
  };

  return (
    <div className="min-h-screen">
      {/* Consent Modal */}
      <ConsentModal
        open={consentOpen}
        testType={pendingTestType}
        onAccept={handleConsentAccept}
        onClose={() => setConsentOpen(false)}
      />

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
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              정보 센터
            </Link>
            <Link href="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <HistoryIcon className="w-3.5 h-3.5" />
              내 기록
            </Link>
            <Button variant="outline" size="sm" onClick={() => openConsent("adult")}>검사 시작</Button>
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
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 gap-2"
                onClick={() => openConsent("adult")}
              >
                성인 자가진단
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5 px-8 gap-2"
                onClick={() => openConsent("child")}
              >
                아동 선별검사
                <ArrowRight className="w-4 h-4" />
              </Button>
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
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
              어떤 검사가 필요하신가요?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              성인 자가진단과 아동 선별검사(학부모용) 두 가지를 제공합니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Adult Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => openConsent("adult")}
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={ADULT_IMG}
                  alt="성인 자가진단"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-primary" />
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">성인용</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-foreground mb-2">성인 자가진단</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  직장, 인간관계, 일상생활에서의 어려움을 15개 문항으로 확인합니다.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">15문항 · 약 5분</span>
                  <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    시작하기 <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Child Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => openConsent("child")}
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={CHILD_IMG}
                  alt="아동 선별검사"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-rose-500" />
                  <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">학부모용</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-foreground mb-2">아동 선별검사</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  자녀의 학습, 사회성, 언어 발달을 18개 문항으로 확인합니다.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">18문항 · 약 7분</span>
                  <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    시작하기 <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
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
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Shield className="w-6 h-6 text-primary" />,
                title: "개인정보 보호",
                desc: "모든 검사는 브라우저 내에서만 처리됩니다. 개인 식별 정보는 수집하지 않습니다.",
              },
              {
                icon: <ClipboardCheck className="w-6 h-6 text-primary" />,
                title: "영역별 상세 분석",
                desc: "인지, 학습, 사회성, 정서 등 영역별로 세분화된 분석 결과를 제공합니다.",
              },
              {
                icon: <Users className="w-6 h-6 text-primary" />,
                title: "전문기관 연계",
                desc: "결과에 따라 가까운 전문기관과 지원 서비스를 안내해 드립니다.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-serif font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
                경계선 지능이란 무엇인가요?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                경계선 지능(Borderline Intellectual Functioning)은 IQ 71~84 범위에 해당하는 인지 능력 수준입니다.
                지적장애로 분류되지 않아 복지 서비스의 사각지대에 놓여 있습니다.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                국내 약 700만 명이 해당하는 것으로 추산되지만, 적절한 지원을 받지 못하는 경우가 많습니다.
                조기 발견과 적절한 지원이 있다면 충분히 일상생활을 영위할 수 있습니다.
              </p>
              <Link href="/info">
                <Button variant="outline" className="gap-2">
                  <BookOpen className="w-4 h-4" /> 자세히 알아보기
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: "지적장애", iq: "IQ 70 이하", color: "bg-red-50 border-red-200 text-red-700" },
                { label: "경계선 지능", iq: "IQ 71~84", color: "bg-amber-50 border-amber-200 text-amber-700", highlight: true },
                { label: "평균 지능", iq: "IQ 85~115", color: "bg-green-50 border-green-200 text-green-700" },
                { label: "우수 지능", iq: "IQ 116 이상", color: "bg-blue-50 border-blue-200 text-blue-700" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`p-4 rounded-xl border ${item.color} ${item.highlight ? "ring-2 ring-amber-300" : ""}`}
                >
                  <p className="text-xs font-medium mb-1">{item.label}</p>
                  <p className="text-lg font-serif font-bold">{item.iq}</p>
                  {item.highlight && (
                    <p className="text-xs mt-1 opacity-70">← 이 범위</p>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 용어 혼동 배너 */}
      <section className="py-10 bg-amber-50/60">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-start md:items-center gap-5 bg-white/80 border border-amber-200 rounded-2xl px-6 py-5"
          >
            <div className="text-2xl shrink-0">⚠️</div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground mb-1">
                &ldquo;경계선 지능&rdquo;과 &ldquo;경계성 지능&rdquo;, 헷갈리시나요?
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                두 용어는 전혀 다른 개념입니다.
                <strong className="text-foreground"> 경계선 지능(BIF)</strong>은 IQ 71~84의 인지 능력 수준을 뜻하며,
                <strong className="text-foreground"> 경계성 인격장애(BPD)</strong>는 감정 조절·대인관계의 어려움을 특징으로 하는 정신건강 진단명입니다.
                본 사이트는 <strong className="text-foreground">경계선 지능(BIF)</strong> 선별 도구입니다.
              </p>
            </div>
            <Link href="/term-diff" className="shrink-0">
              <Button variant="outline" size="sm" className="gap-1.5 border-amber-300 text-amber-800 hover:bg-amber-50 whitespace-nowrap">
                자세히 알아보기 <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
                경계선 지능 정보 센터
              </h2>
              <p className="text-muted-foreground text-sm">전문가 기준의 신뢰할 수 있는 정보를 제공합니다.</p>
            </div>
            <Link href="/blog">
              <Button variant="outline" size="sm" className="gap-1.5 hidden sm:flex">
                전체 보기 <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "경계선 지능이란? 증상과 특징 완전 정리", cat: "기초 정보", slug: "what-is-borderline-intelligence", time: "5분" },
              { title: "우리 아이 경계선 지능 의심될 때 — 부모가 알아야 할 5가지", cat: "아동·청소년", slug: "child-borderline-intelligence-parents-guide", time: "7분" },
              { title: "성인 경계선 지능 자가진단 — 나도 해당될까?", cat: "성인", slug: "adult-borderline-intelligence-self-check", time: "6분" },
              { title: "경계선 지능 지원 제도 총정리 (2026년 최신)", cat: "지원 정보", slug: "borderline-intelligence-support-2026", time: "8분" },
            ].map((item, i) => (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link href={`/blog/${item.slug}`}>
                  <div className="group bg-card rounded-xl border border-border/50 p-5 hover:shadow-md transition-all h-full flex flex-col">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full w-fit mb-3">{item.cat}</span>
                    <h3 className="text-sm font-semibold text-foreground leading-snug mb-3 flex-1 group-hover:text-primary transition-colors">{item.title}</h3>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Newspaper className="w-3 h-3" /> {item.time} 읽기
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Notify Banner */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-2">
                아직 검사가 망설여지시나요?
              </h2>
              <p className="text-sm text-muted-foreground">
                전문가 자문 서비스 오픈 시 가장 먼저 알림을 받아보세요.
              </p>
            </div>
            <EmailNotifyWidget />
          </motion.div>
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
            className="bg-primary rounded-3xl p-10 md:p-16 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary-foreground mb-4">
              지금 바로 확인해보세요
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
              5~10분으로 경계선 지능의 가능성을 확인하고, 상세 PDF 리포트를 받아보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 px-8 gap-2"
                onClick={() => openConsent("adult")}
              >
                성인 자가진단 시작 <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 px-8 gap-2"
                onClick={() => openConsent("child")}
              >
                아동 선별검사 시작 <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border/50 bg-secondary/20">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              <span className="font-serif font-semibold text-foreground">마음이음</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              본 서비스는 의학적 진단을 대체하지 않습니다. 정확한 진단은 전문기관을 통해 받으시기 바랍니다.
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <Link href="/info" className="hover:text-foreground transition-colors">경계선 지능이란?</Link>
              <Link href="/blog" className="hover:text-foreground transition-colors">정보 센터</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
