/**
 * TermDiff Page - 경계선 지능 vs 경계성 인격장애 차이점 설명
 * Design: Warm Guidance - clear, non-stigmatizing educational content
 * /term-diff 경로
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, Heart, AlertCircle, CheckCircle2, XCircle, HelpCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay },
});

export default function TermDiff() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/50">
        <div className="container flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">홈으로</span>
          </Link>
          <span className="text-sm font-medium text-foreground">용어 차이 알아보기</span>
          <div />
        </div>
      </header>

      <main className="container max-w-3xl py-10 md:py-16">

        {/* 타이틀 */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <AlertCircle className="w-3.5 h-3.5" />
            많이 혼동되는 용어
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3 leading-snug">
            "경계선 지능"과 "경계성 지능"은<br />
            <span className="text-primary">같은 말인가요?</span>
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            두 용어는 발음이 비슷해 자주 혼동되지만, 실제로는 <strong>전혀 다른 개념</strong>입니다.
            또한 "경계성 인격장애(BPD)"와도 혼동되는 경우가 많습니다.
            아래에서 명확하게 정리해 드립니다.
          </p>
        </motion.div>

        {/* 핵심 요약 카드 2개 */}
        <motion.div {...fadeUp(0.1)} className="grid md:grid-cols-2 gap-4 mb-10">
          {/* BIF 카드 */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wide">BIF</p>
                <p className="text-sm font-bold text-blue-900">경계선 지능</p>
              </div>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed mb-3">
              <strong>Borderline Intellectual Functioning</strong><br />
              지능지수(IQ) <strong>71~84</strong> 범위의 인지 능력 수준을 가리키는 말입니다.
              지적장애(IQ ≤70)보다는 높지만 평균(IQ 85~115)에는 미치지 못하는 영역입니다.
            </p>
            <div className="space-y-1.5">
              {["발달·교육 분야 용어", "인지 능력(지능)과 관련", "진단명이 아닌 기능 수준 묘사", "약 700만 명 해당 추산 (한국)"].map(t => (
                <div key={t} className="flex items-center gap-2 text-xs text-blue-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* BPD 카드 */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-rose-400 uppercase tracking-wide">BPD</p>
                <p className="text-sm font-bold text-rose-900">경계성 인격장애</p>
              </div>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed mb-3">
              <strong>Borderline Personality Disorder</strong><br />
              감정 조절의 어려움, 불안정한 대인관계, 충동성 등을 특징으로 하는
              <strong> 정신건강 진단명</strong>입니다. 지능과는 무관합니다.
            </p>
            <div className="space-y-1.5">
              {["정신건강 임상 분야 진단명", "감정·행동·대인관계와 관련", "DSM-5 공식 진단 기준 존재", "지능 수준과 직접적 관련 없음"].map(t => (
                <div key={t} className="flex items-center gap-2 text-xs text-rose-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 상세 비교표 */}
        <motion.div {...fadeUp(0.2)} className="mb-10">
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-border/50 bg-secondary/30">
              <h2 className="text-base font-serif font-bold text-foreground">한눈에 보는 비교</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground w-1/4">구분</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-blue-600 w-3/8">경계선 지능 (BIF)</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-rose-500 w-3/8">경계성 인격장애 (BPD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {[
                    ["분야", "발달·교육·복지", "정신건강 임상"],
                    ["핵심 개념", "인지 능력(지능) 수준", "감정·행동·대인관계 패턴"],
                    ["IQ와의 관계", "IQ 71~84로 정의됨", "IQ와 무관 (어느 수준이든 가능)"],
                    ["진단 여부", "공식 진단명 아님 (기능 묘사)", "DSM-5 공식 진단명"],
                    ["주요 증상", "학습 어려움, 느린 이해, 적응 어려움", "감정 기복, 충동성, 불안정한 관계"],
                    ["관련 전문가", "임상심리사, 특수교육사, 복지사", "정신건강의학과 전문의, 임상심리사"],
                    ["치료/지원", "교육적 지원, 직업 훈련, 복지 서비스", "변증법적 행동치료(DBT), 약물치료"],
                  ].map(([label, bif, bpd]) => (
                    <tr key={label} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-3 text-xs font-semibold text-muted-foreground">{label}</td>
                      <td className="px-4 py-3 text-xs text-foreground">{bif}</td>
                      <td className="px-4 py-3 text-xs text-foreground">{bpd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* "경계선 지능" vs "경계성 지능" 표기 차이 */}
        <motion.div {...fadeUp(0.3)} className="mb-10">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-base font-serif font-bold text-amber-900 mb-2">
                  "경계선 지능"과 "경계성 지능"은 같은 말인가요?
                </h2>
                <p className="text-sm text-amber-800 leading-relaxed mb-3">
                  결론부터 말하면, <strong>같은 개념을 가리키는 두 가지 표현</strong>입니다.
                  영문 'Borderline Intellectual Functioning'을 번역할 때 사람에 따라
                  <strong> "경계선"</strong> 또는 <strong>"경계성"</strong>으로 다르게 표기하기 때문입니다.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      <strong>경계선 지능</strong> — 학술 논문, 정부 정책 문서, 복지 분야에서 주로 사용하는 공식 표현입니다.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      <strong>경계성 지능</strong> — 일반 대중이 검색할 때 자주 사용하는 표현으로, 같은 개념을 가리킵니다.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      <strong>경계성 인격장애(BPD)</strong>와는 완전히 다른 개념입니다. 혼동하지 않도록 주의하세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 오해와 진실 */}
        <motion.div {...fadeUp(0.4)} className="mb-10">
          <h2 className="text-lg font-serif font-bold text-foreground mb-4">자주 하는 오해</h2>
          <div className="space-y-3">
            {[
              {
                q: "경계선 지능이면 지적장애인가요?",
                a: "아닙니다. 지적장애는 IQ 70 이하로, 경계선 지능(IQ 71~84)과는 구별됩니다. 경계선 지능은 공식 장애 진단이 아닙니다.",
                type: "no",
              },
              {
                q: "경계선 지능인 사람은 감정 조절이 어렵나요?",
                a: "경계선 지능 자체가 감정 조절 어려움을 의미하지는 않습니다. 감정 조절 어려움은 경계성 인격장애(BPD)의 특징입니다. 물론 경계선 지능인 사람도 스트레스 상황에서 감정 조절이 어려울 수 있지만, 이는 별개의 문제입니다.",
                type: "no",
              },
              {
                q: "경계선 지능은 치료가 필요한 병인가요?",
                a: "경계선 지능은 질병이나 장애가 아닙니다. 다만 적절한 교육적 지원, 직업 훈련, 사회적 지원이 필요할 수 있습니다. 조기에 발견하고 지원하면 일상생활에서 충분히 잘 적응할 수 있습니다.",
                type: "no",
              },
              {
                q: "경계선 지능과 경계성 인격장애가 동시에 있을 수 있나요?",
                a: "가능합니다. 두 개념은 완전히 별개이므로, 한 사람이 경계선 지능 수준이면서 동시에 경계성 인격장애 진단을 받을 수도 있습니다. 하지만 이는 우연한 동반이지, 두 개념이 연관되어 있기 때문이 아닙니다.",
                type: "info",
              },
            ].map(({ q, a, type }) => (
              <div key={q} className="bg-card rounded-xl border border-border/50 p-5">
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${type === "no" ? "bg-rose-100" : "bg-blue-100"}`}>
                    {type === "no"
                      ? <XCircle className="w-4 h-4 text-rose-500" />
                      : <HelpCircle className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1.5">Q. {q}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 정리 메시지 */}
        <motion.div {...fadeUp(0.5)} className="mb-10">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
            <Brain className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="text-base font-serif font-bold text-foreground mb-2">핵심 정리</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              <strong className="text-foreground">경계선 지능 = 경계성 지능</strong> (같은 말, BIF)<br />
              <strong className="text-foreground">경계성 인격장애</strong>는 완전히 다른 개념 (BPD)<br />
              <br />
              경계선 지능은 <strong className="text-foreground">장애가 아닙니다.</strong><br />
              적절한 이해와 지원이 있다면 누구나 자신에게 맞는 삶을 살아갈 수 있습니다.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp(0.6)} className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/test/adult">
            <Button className="w-full sm:w-auto gap-2">
              <Brain className="w-4 h-4" /> 성인 자가진단 해보기
            </Button>
          </Link>
          <Link href="/test/child">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <Heart className="w-4 h-4" /> 아동 선별검사 해보기
            </Button>
          </Link>
          <Link href="/info">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <BookOpen className="w-4 h-4" /> 경계선 지능 더 알아보기
            </Button>
          </Link>
        </motion.div>
      </main>

      <footer className="py-8 border-t border-border/50 mt-8">
        <div className="container">
          <p className="text-xs text-muted-foreground text-center">
            본 서비스는 의학적 진단을 대체하지 않습니다. 정확한 진단은 반드시 전문기관을 통해 받으시기 바랍니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
