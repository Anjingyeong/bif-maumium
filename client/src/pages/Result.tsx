/**
 * Result Page - Score analysis and recommendations
 * Design: Warm Guidance - supportive, non-judgmental framing
 */
import { useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Brain, Heart, ArrowLeft, Phone, ExternalLink, RotateCcw, BookOpen } from "lucide-react";
import {
  getResultLevel,
  getCategoryScores,
  adultQuestions,
  childQuestions,
  supportResources,
  AnswerValue,
} from "@/lib/questions";

const RESULT_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663648097828/6VHeQEzjYKHfh7CdssTj54/result-bg-o79GvS4Xzaz8RqGYiPqNCU.webp";

export default function Result() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const type = params.get('type') as 'adult' | 'child' || 'adult';
  const score = parseInt(params.get('score') || '0', 10);
  const answersRaw = params.get('answers');
  
  const answers: Record<number, AnswerValue> = useMemo(() => {
    try {
      return answersRaw ? JSON.parse(answersRaw) : {};
    } catch {
      return {};
    }
  }, [answersRaw]);

  const questionSet = type === 'adult' ? adultQuestions : childQuestions;
  const maxScore = questionSet.questions.length * 3;
  const result = getResultLevel(score, type);
  const categoryScores = getCategoryScores(answers, questionSet.questions);
  const percentage = Math.round((score / maxScore) * 100);

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
            {type === 'adult' ? <Brain className="w-5 h-5 text-primary" /> : <Heart className="w-5 h-5 text-accent" />}
            <span className="text-sm font-medium text-foreground">검사 결과</span>
          </div>
          <div />
        </div>
      </header>

      <main className="container max-w-3xl py-8 md:py-12">
        {/* Result Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl mb-8"
        >
          <div className="absolute inset-0">
            <img src={RESULT_BG} alt="" className="w-full h-full object-cover opacity-30" />
          </div>
          <div className="relative p-8 md:p-12 text-center">
            {/* Score Circle */}
            <div className="relative w-36 h-36 mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-border"
                />
                <motion.circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke={result.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - percentage / 100) }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-serif font-bold text-foreground">{score}</span>
                <span className="text-xs text-muted-foreground">/ {maxScore}</span>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">
              {result.title}
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
              {result.description}
            </p>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 mb-8"
        >
          <h2 className="text-lg font-serif font-bold text-foreground mb-6">영역별 분석</h2>
          <div className="space-y-4">
            {Object.entries(categoryScores).map(([category, { score: catScore, max }]) => {
              const catPercentage = Math.round((catScore / max) * 100);
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-foreground">{category}</span>
                    <span className="text-xs text-muted-foreground">{catScore}/{max}</span>
                  </div>
                  <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: catPercentage > 60 ? result.color : 'oklch(0.55 0.12 250)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${catPercentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 mb-8"
        >
          <h2 className="text-lg font-serif font-bold text-foreground mb-4">권장 사항</h2>
          <div className="bg-secondary/50 rounded-xl p-5">
            <p className="text-sm text-foreground leading-relaxed">
              {result.recommendation}
            </p>
          </div>
        </motion.div>

        {/* Support Resources */}
        {(result.level === 'moderate' || result.level === 'high') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 mb-8"
          >
            <h2 className="text-lg font-serif font-bold text-foreground mb-4">도움받을 수 있는 곳</h2>
            <div className="space-y-3">
              {supportResources.map((resource, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    {resource.phone ? <Phone className="w-4 h-4 text-primary" /> : <ExternalLink className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{resource.name}</p>
                    <p className="text-xs text-muted-foreground">{resource.description}</p>
                    {resource.phone && (
                      <a href={`tel:${resource.phone}`} className="text-xs text-primary font-medium mt-1 inline-block">
                        {resource.phone}
                      </a>
                    )}
                    {resource.url && (
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-medium mt-1 inline-block">
                        방문하기 →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-secondary/30 rounded-xl p-5 mb-8"
        >
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            <strong>주의:</strong> 본 결과는 선별 목적의 참고 자료이며, 의학적 진단을 대체하지 않습니다.
            정확한 진단을 위해서는 반드시 전문기관을 방문하시기 바랍니다.
            경계선 지능은 적절한 지원을 통해 충분히 개선될 수 있습니다.
          </p>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={type === 'adult' ? '/test/adult' : '/test/child'}>
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <RotateCcw className="w-4 h-4" /> 다시 검사하기
            </Button>
          </Link>
          <Link href="/info">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <BookOpen className="w-4 h-4" /> 경계선 지능 알아보기
            </Button>
          </Link>
          <Link href="/">
            <Button className="w-full sm:w-auto bg-primary text-primary-foreground">
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
