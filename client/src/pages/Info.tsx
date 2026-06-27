/**
 * Info Page - About Borderline Intellectual Functioning
 * Design: Warm Guidance - Editorial layout with clear information hierarchy
 */
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Brain, ArrowLeft, ArrowRight, BookOpen, Users, GraduationCap, HeartHandshake, AlertCircle } from "lucide-react";

export default function Info() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/50">
        <div className="container flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">홈으로</span>
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">경계선 지능이란?</span>
          </div>
          <div />
        </div>
      </header>

      <main className="container max-w-3xl py-8 md:py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            경계선 지능이란 무엇인가요?
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            경계선 지능(Borderline Intellectual Functioning)은 지적장애와 평균 지능 사이에 위치하는 
            인지 능력 수준을 말합니다. 장애가 아닌, 하나의 특성입니다.
          </p>
        </motion.div>

        {/* Definition Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="bg-card rounded-xl border border-border/50 p-6 md:p-8">
            <h2 className="text-xl font-serif font-bold text-foreground mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              정의와 기준
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                경계선 지능은 일반적으로 <strong className="text-foreground">지능지수(IQ) 71~84</strong> 범위에 해당하는 
                인지 능력을 의미합니다. 이는 지적장애(IQ 70 이하)보다는 높지만, 평균 지능(IQ 85~115)에는 
                미치지 못하는 수준입니다.
              </p>
              <p>
                DSM-IV에서는 V코드(V62.89)로 분류되었으나, DSM-5에서는 별도의 진단 코드가 없어 
                제도적 사각지대에 놓여 있습니다. 한국에서는 전체 인구의 약 13.6%, 
                약 <strong className="text-foreground">700만 명</strong>이 이에 해당하는 것으로 추산됩니다.
              </p>
            </div>

            {/* IQ Scale Visual */}
            <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
              <p className="text-xs font-medium text-muted-foreground mb-3">지능지수 분포</p>
              <div className="relative h-8 rounded-full overflow-hidden bg-border">
                <div className="absolute inset-y-0 left-0 w-[14%] bg-muted-foreground/20" />
                <div className="absolute inset-y-0 left-[14%] w-[14%] bg-primary/35" />
                <div className="absolute inset-y-0 left-[28%] w-[44%] bg-muted-foreground/12" />
                <div className="absolute inset-y-0 left-[72%] w-[28%] bg-muted-foreground/20" />
                {/* Labels */}
                <div className="absolute inset-0 flex items-center">
                  <span className="absolute left-[7%] -translate-x-1/2 text-[10px] font-medium text-foreground/70">~70</span>
                  <span className="absolute left-[21%] -translate-x-1/2 text-[10px] font-bold text-foreground">71-84</span>
                  <span className="absolute left-[50%] -translate-x-1/2 text-[10px] font-medium text-foreground/70">85-115</span>
                  <span className="absolute left-[86%] -translate-x-1/2 text-[10px] font-medium text-foreground/70">116+</span>
                </div>
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                <span>지적장애</span>
                <span className="font-bold text-primary">경계선 지능</span>
                <span>평균</span>
                <span>우수</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 용어 혼동 섹션 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="bg-card border border-border/60 rounded-xl p-6 md:p-8">
            <h2 className="text-xl font-serif font-bold text-foreground mb-1 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              "경계선 지능" vs "경계성 지능" — 같은 말인가요?
            </h2>
            <p className="text-xs text-muted-foreground mb-5">많이 혼동하시는 용어입니다. 둘은 전혀 다른 개념입니다.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-secondary/30 rounded-xl p-5 border border-border/60">
                <p className="text-sm font-bold text-primary mb-2">경계선 지능 (境界線 知能)</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  <strong className="text-foreground">인지 능력(IQ)</strong>에 관한 개념입니다.<br />
                  IQ 71~84 범위로, 지적장애와 평균 지능 사이에 위치합니다.
                  학습·적응·실행기능 등에서 어려움을 겪을 수 있으며,
                  <strong className="text-foreground"> 발달·교육 분야</strong>에서 주로 사용하는 용어입니다.
                </p>
                <div className="text-[11px] bg-primary/10 text-primary rounded-xl px-3 py-2 font-medium">
                  영문: Borderline Intellectual Functioning (BIF)
                </div>
              </div>
              <div className="bg-secondary/30 rounded-xl p-5 border border-border/60">
                <p className="text-sm font-bold text-foreground mb-2">경계성 인격장애 (境界性 人格障碍)</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  <strong className="text-foreground">성격·정서 조절</strong>에 관한 개념입니다.<br />
                  극단적인 감정 기복, 충동성, 불안정한 대인관계가 특징이며,
                  지능과는 무관합니다.
                  <strong className="text-foreground"> 정신건강 임상 분야</strong>에서 사용하는 진단명입니다.
                </p>
                <div className="text-[11px] bg-secondary text-muted-foreground rounded-xl px-3 py-2 font-medium">
                  영문: Borderline Personality Disorder (BPD)
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              본 사이트의 검사는 <strong>경계선 지능(BIF)</strong>을 선별하는 도구입니다. 경계성 인격장애(BPD)와는 관련이 없습니다.
            </p>
            <div className="mt-4 text-center">
              <a href="/term-diff" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/25 rounded-xl px-4 py-2 hover:bg-primary/10 transition-colors">
                두 용어 상세 비교 보기 →
              </a>
            </div>
          </div>
        </motion.section>

        {/* Characteristics */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="bg-card rounded-xl border border-border/50 p-6 md:p-8">
            <h2 className="text-xl font-serif font-bold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              주요 특성
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "학습", desc: "새로운 내용을 배우는 속도가 느리고, 반복 학습이 필요합니다." },
                { title: "인지", desc: "복잡한 문제 해결이나 추상적 사고에 어려움을 겪을 수 있습니다." },
                { title: "사회성", desc: "사회적 상황 파악이나 비유적 표현 이해가 어려울 수 있습니다." },
                { title: "적응", desc: "새로운 환경에 적응하는 데 시간이 더 필요합니다." },
                { title: "실행기능", desc: "계획 수립, 시간 관리, 조직화에 어려움이 있을 수 있습니다." },
                { title: "정서", desc: "감정 조절이 어렵거나 스트레스에 취약할 수 있습니다." },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Support & Help */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="bg-card rounded-xl border border-border/50 p-6 md:p-8">
            <h2 className="text-xl font-serif font-bold text-foreground mb-4 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-primary" />
              지원과 도움
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                경계선 지능은 적절한 지원과 환경이 갖춰진다면 충분히 사회에 적응하고 
                자립적인 생활을 영위할 수 있습니다. 중요한 것은 <strong className="text-foreground">조기 발견과 맞춤형 지원</strong>입니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div className="p-4 rounded-xl bg-secondary/30">
                  <GraduationCap className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs font-semibold text-foreground mb-1">교육 지원</p>
                  <p className="text-xs text-muted-foreground">
                    기초학력보장법에 따른 학습 지원, Wee센터 상담, 특수교육 지원센터 활용
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30">
                  <Users className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs font-semibold text-foreground mb-1">사회적 지원</p>
                  <p className="text-xs text-muted-foreground">
                    서울시 경계선지능인 평생교육지원센터, 지자체 조례에 따른 지원 프로그램
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Important Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-primary/5 border border-primary/20 rounded-xl p-6 md:p-8 mb-8"
        >
          <h3 className="text-lg font-serif font-bold text-foreground mb-3">
            꼭 기억해주세요
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              경계선 지능은 '장애'가 아니라 하나의 '특성'입니다.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              적절한 지원이 있다면 누구나 자신에게 맞는 삶을 살아갈 수 있습니다.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              온라인 체크리스트는 선별 목적이며, 표준화 지능검사·적응행동검사·면담을 포함한 정확한 평가는 전문가를 통해 받으세요.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              조기 발견과 지원이 이루어질수록 더 좋은 결과를 기대할 수 있습니다.
            </li>
          </ul>
        </motion.div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/test/adult">
            <Button className="w-full sm:w-auto bg-primary text-primary-foreground gap-2">
              성인 자가체크 <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/test/child">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              아동 선별검사 <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 mt-12">
        <div className="container">
          <p className="text-xs text-muted-foreground text-center">
            본 서비스는 진단 도구가 아니라 선별용 자가체크입니다. 정확한 평가는 반드시 전문기관을 통해 받으시기 바랍니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
