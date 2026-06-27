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
import { Brain, Heart, BookOpen, ArrowRight, Shield, Users, ClipboardCheck, Newspaper, Handshake, Mail } from "lucide-react";
import NavBar from "@/components/NavBar";
import EmailNotifyWidget from "@/components/EmailNotifyWidget";
import StartTestModal from "@/components/StartTestModal";
import Footer from "@/components/Footer";
import { SERVICE_COPY } from "@/constants/serviceCopy";
import { LEGAL_COPY } from "@/constants/legalCopy";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663648097828/6VHeQEzjYKHfh7CdssTj54/hero-bg-G22PuoZQMHzrhaaPXVfouj.webp";
const CHILD_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663648097828/6VHeQEzjYKHfh7CdssTj54/child-section-2q9N99eJL9sDbwdufTEuCS.webp";
const ADULT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663648097828/6VHeQEzjYKHfh7CdssTj54/adult-section-Las3h5McrYzSYMVrCZmJEN.webp";
const PARTNERSHIP_EMAIL = SERVICE_COPY.CONTACT_EMAIL;

export default function Home() {
  const [, navigate] = useLocation();
  const [startModalOpen, setStartModalOpen] = useState(false);

  const getTestPath = (type: "adult" | "child") =>
    `/test/${type}?run=${Date.now().toString(36)}`;

  const openConsent = (type: "adult" | "child") => {
    navigate(getTestPath(type));
  };

  const handleStartSelection = (type: "adult" | "child") => {
    setStartModalOpen(false);
    navigate(getTestPath(type));
  };

  return (
    <div className="min-h-screen">
      <StartTestModal
        open={startModalOpen}
        onClose={() => setStartModalOpen(false)}
        onStart={handleStartSelection}
      />

      {/* Navigation */}
      <NavBar onStartTest={() => setStartModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover object-[62%_58%] md:object-[70%_52%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/20 to-background" />
        </div>
        <div className="relative container py-24 md:py-36 lg:py-44">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[43rem] min-w-0"
          >
            <p className="text-xs font-medium text-primary bg-primary/8 px-3 py-1.5 rounded-full inline-flex mb-4 border border-primary/15">
              선별용 자가체크 서비스
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-extrabold text-foreground leading-tight mb-5">
              느린학습자·경계선 지능<br />
              <span className="text-primary">자가체크 테스트</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/75 leading-relaxed mb-5 max-w-[36rem]">
              마음이음은 느린학습자와 경계선 지능 특성을 간단한 문항으로 확인해보는 참고용 자가체크입니다.
              결과는 이해를 돕기 위한 자료이며 전문가 상담이나 검사를 대체하지 않습니다.
            </p>
            <div className="w-full max-w-[36rem] mb-8 rounded-xl border border-border bg-card/80 px-4 py-3 text-xs text-muted-foreground leading-relaxed shadow-sm">
              <strong className="text-foreground">안내:</strong> 본 검사는 선별용 자가체크입니다. 결과는 가능성 참고용이며, 필요한 경우 전문가 평가를 권장합니다.
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="w-full sm:w-auto max-w-full bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/40 px-8 gap-2 shadow-sm"
                onClick={() => openConsent("adult")}
              >
                성인용 자가체크 시작하기
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto max-w-full border-primary/40 text-primary hover:bg-primary/5 focus-visible:ring-primary/30 px-8 gap-2"
                onClick={() => openConsent("child")}
              >
                우리 아이 발달 상태 살펴보기
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

      {/* SEO Keyword Intro Section */}
      <section className="py-14 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full inline-flex mb-4">
              마음이음 참고용 자가체크
            </p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
              느린학습자 테스트와 경계선 지능 자가체크를 한곳에서
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              느린학습자 자가체크, 경계선 지능 테스트, 경계선 지능 체크리스트를 찾는 분들이
              부담 없이 살펴볼 수 있도록 성인용 자가체크와 자녀를 위한 보호자 체크를 제공합니다.
              느린학습자 체크리스트는 최근 생활 경험을 기준으로 답하며, 결과는 참고용 안내로만 활용해 주세요.
            </p>
          </div>
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
              성인 자가체크와 아동 선별검사(학부모용) 두 가지를 제공합니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Adult Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-sm transition-all duration-300 cursor-pointer"
              onClick={() => openConsent("adult")}
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={ADULT_IMG}
                  alt="성인 자가체크"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-primary" />
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">성인용</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-foreground mb-2">성인 자가체크</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  직장, 인간관계, 일상생활에서의 학습·인지·적응기능 어려움을 15개 문항으로 점검합니다.
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
              className="group bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-sm transition-all duration-300 cursor-pointer"
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
                  <Heart className="w-5 h-5 text-primary" />
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">학부모용</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-foreground mb-2">아동 선별검사</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  자녀의 학습, 인지, 사회적 판단, 일상 적응 모습을 18개 문항으로 점검합니다.
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
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <Shield className="w-5 h-5 text-primary" />,
                title: "개인정보 보호",
                desc: "모든 검사는 브라우저 내에서만 처리됩니다. 개인 식별 정보는 수집하지 않습니다.",
              },
              {
                icon: <ClipboardCheck className="w-5 h-5 text-primary" />,
                title: "영역별 상세 분석",
                desc: "학습/개념 이해, 작업기억, 처리속도, 실행기능, 사회적 판단, 일상 적응 등 영역별 분석을 제공합니다.",
              },
              {
                icon: <Users className="w-5 h-5 text-primary" />,
                title: "전문기관 연계",
                desc: "결과 수준에 따라 전문 평가와 지원 정보를 안내합니다.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-start p-6 rounded-xl bg-card border border-border/60 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center mb-4">
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
                { label: "지적장애", iq: "IQ 70 이하", color: "bg-secondary/50 border-border text-muted-foreground" },
                { label: "경계선 지능", iq: "IQ 71~84", color: "bg-primary/5 border-primary/20 text-primary", highlight: true },
                { label: "평균 지능", iq: "IQ 85~115", color: "bg-secondary/50 border-border text-muted-foreground" },
                { label: "우수 지능", iq: "IQ 116 이상", color: "bg-secondary/50 border-border text-muted-foreground" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`p-4 rounded-xl border ${item.color} ${item.highlight ? "ring-2 ring-primary/20" : ""}`}
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
      <section className="py-10 bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-start md:items-center gap-5 bg-card border border-border/60 rounded-xl px-5 sm:px-6 py-5 overflow-hidden"
          >
            <BookOpen className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
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
            <Link href="/term-diff" className="w-full md:w-auto shrink-0">
              <Button variant="outline" size="sm" className="w-full md:w-auto gap-1.5 border-primary/20 text-primary hover:bg-primary/5 whitespace-nowrap">
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
              { title: "성인 경계선 지능 가능성 자가체크 — 어떤 지원이 필요할까?", cat: "성인", slug: "adult-borderline-intelligence-self-check", time: "6분" },
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
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-2">
                마음이음 소식과 문의
              </h2>
              <p className="text-sm text-muted-foreground">
                오픈 알림/업데이트와 협업·제휴 문의를 각각의 목적에 맞게 안내합니다.
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)] items-stretch">
              <EmailNotifyWidget />
              <div className="bg-card border border-border/60 rounded-xl p-6 md:p-8 flex flex-col">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Handshake className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base">협업·제휴 문의</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                      교육기관, 상담센터, 연구, 콘텐츠 제휴 문의는 이메일로 연락해 주세요.
                    </p>
                  </div>
                </div>
                <div className="rounded-xl bg-secondary/50 border border-border/50 p-4 mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1">협업/제휴 문의</p>
                  <a
                    href={`mailto:${PARTNERSHIP_EMAIL}?subject=${encodeURIComponent("마음이음 협업/제휴 문의")}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-xl"
                  >
                    <Mail className="w-4 h-4" />
                    {PARTNERSHIP_EMAIL}
                  </a>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mt-auto">
                  협업 문의 메일에는 기관명, 담당자 연락처, 문의 목적 등 회신에 필요한 정보를 직접 작성해 주세요.
                  해당 메일은 알림 신청 이메일 저장과 별도로 처리됩니다.
                </p>
              </div>
            </div>
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
            className="bg-primary/6 border border-primary/15 rounded-3xl p-10 md:p-16 text-center"
          >
            <p className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full inline-flex mb-4">
              지금 바로 시작해보세요
            </p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
              지금 바로 확인해보세요
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm leading-relaxed">
              5~10분으로 학습·인지·적응기능 어려움 가능성을 점검하고, 상세 PDF 리포트를 받아보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/40 px-8 gap-2"
                onClick={() => openConsent("adult")}
              >
                성인 자가체크 시작 <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/5 px-8 gap-2"
                onClick={() => openConsent("child")}
              >
                아동 선별검사 시작 <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
