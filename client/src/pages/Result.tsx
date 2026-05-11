/**
 * Result Page - Score analysis and recommendations
 * Design: Warm Guidance - supportive, non-judgmental framing
 * Features: localStorage 이력 저장, 이전 결과 비교, PDF 다운로드
 */
import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Brain, Heart, ArrowLeft, Phone, ExternalLink,
  RotateCcw, BookOpen, Download, Loader2,
  TrendingUp, TrendingDown, Minus, History,
} from "lucide-react";
import { toast } from "sonner";
import {
  getResultLevel,
  getCategoryScores,
  adultQuestions,
  childQuestions,
  supportResources,
  AnswerValue,
} from "@/lib/questions";
import { generateResultPdf } from "@/lib/generatePdf";
import FeedbackWidget from "@/components/FeedbackWidget";
import {
  saveTestRecord,
  getLastRecord,
  getScoreDiff,
  formatDate,
  TestRecord,
} from "@/lib/history";

const RESULT_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663648097828/6VHeQEzjYKHfh7CdssTj54/result-bg-o79GvS4Xzaz8RqGYiPqNCU.webp";

export default function Result() {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [prevRecord, setPrevRecord] = useState<TestRecord | null>(null);
  const savedRef = useRef(false);

  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const type = (params.get("type") as "adult" | "child") || "adult";
  const score = parseInt(params.get("score") || "0", 10);
  const answersRaw = params.get("answers");

  const answers: Record<number, AnswerValue> = useMemo(() => {
    try {
      return answersRaw ? JSON.parse(answersRaw) : {};
    } catch {
      return {};
    }
  }, [answersRaw]);

  const questionSet = type === "adult" ? adultQuestions : childQuestions;
  const maxScore = questionSet.questions.length * 3;
  const result = getResultLevel(score, type);
  const categoryScores = getCategoryScores(answers, questionSet.questions);
  const percentage = Math.round((score / maxScore) * 100);

  // 결과 페이지 진입 시 이전 기록 조회 후 현재 결과 저장 (한 번만 실행)
  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;

    const last = getLastRecord(type);
    setPrevRecord(last);

    saveTestRecord({
      type,
      score,
      maxScore,
      level: result.level,
      levelTitle: result.title,
      categoryScores,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scoreDiff = prevRecord ? getScoreDiff(score, prevRecord.score) : null;

  const handleDownloadPdf = async () => {
    setIsPdfLoading(true);
    try {
      await generateResultPdf({ type, score, maxScore, result, answers, questionSet });
      toast.success("PDF 리포트가 다운로드되었습니다.");
    } catch (err) {
      console.error(err);
      toast.error("PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsPdfLoading(false);
    }
  };

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
            {type === "adult" ? <Brain className="w-5 h-5 text-primary" /> : <Heart className="w-5 h-5 text-accent" />}
            <span className="text-sm font-medium text-foreground">검사 결과</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadPdf}
            disabled={isPdfLoading}
            className="gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/5"
          >
            {isPdfLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            PDF 저장
          </Button>
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
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-border" />
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

            <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">{result.title}</h1>
            <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">{result.description}</p>
          </div>
        </motion.div>

        {/* ── 이전 결과 비교 섹션 ── */}
        {prevRecord && scoreDiff && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-card rounded-2xl border border-border/50 p-6 mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-serif font-bold text-foreground">이전 검사와 비교</h2>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-5">
              {/* 이전 점수 */}
              <div className="text-center p-4 rounded-xl bg-secondary/40">
                <p className="text-xs text-muted-foreground mb-1">이전 검사</p>
                <p className="text-2xl font-serif font-bold text-muted-foreground">{prevRecord.score}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(prevRecord.date)}</p>
              </div>

              {/* 변화량 */}
              <div className="text-center p-4 rounded-xl bg-secondary/40 flex flex-col items-center justify-center">
                {scoreDiff.direction === "up" && (
                  <>
                    <TrendingUp className="w-6 h-6 text-red-500 mb-1" />
                    <p className="text-xl font-bold text-red-500">+{scoreDiff.diff}</p>
                    <p className="text-xs text-muted-foreground">점 상승</p>
                  </>
                )}
                {scoreDiff.direction === "down" && (
                  <>
                    <TrendingDown className="w-6 h-6 text-green-600 mb-1" />
                    <p className="text-xl font-bold text-green-600">-{scoreDiff.diff}</p>
                    <p className="text-xs text-muted-foreground">점 하락</p>
                  </>
                )}
                {scoreDiff.direction === "same" && (
                  <>
                    <Minus className="w-6 h-6 text-muted-foreground mb-1" />
                    <p className="text-xl font-bold text-muted-foreground">0</p>
                    <p className="text-xs text-muted-foreground">변화 없음</p>
                  </>
                )}
              </div>

              {/* 현재 점수 */}
              <div className="text-center p-4 rounded-xl" style={{ backgroundColor: `${result.color}15`, border: `1px solid ${result.color}30` }}>
                <p className="text-xs text-muted-foreground mb-1">이번 검사</p>
                <p className="text-2xl font-serif font-bold text-foreground">{score}</p>
                <p className="text-xs text-muted-foreground mt-1">오늘</p>
              </div>
            </div>

            {/* 영역별 비교 바 */}
            <div className="space-y-3">
              {Object.entries(categoryScores).map(([category, { score: catScore, max }]) => {
                const prevCatScore = prevRecord.categoryScores?.[category];
                const catPct = Math.round((catScore / max) * 100);
                const prevCatPct = prevCatScore ? Math.round((prevCatScore.score / prevCatScore.max) * 100) : null;

                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground">{category}</span>
                      <span className="text-xs text-muted-foreground">
                        {catScore}/{max}
                        {prevCatScore && (
                          <span className={`ml-2 font-medium ${catScore > prevCatScore.score ? "text-red-500" : catScore < prevCatScore.score ? "text-green-600" : "text-muted-foreground"}`}>
                            {catScore > prevCatScore.score ? `+${catScore - prevCatScore.score}` : catScore < prevCatScore.score ? `${catScore - prevCatScore.score}` : "±0"}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="relative h-2.5 bg-secondary rounded-full overflow-hidden">
                      {/* 이전 결과 (반투명) */}
                      {prevCatPct !== null && (
                        <div
                          className="absolute top-0 left-0 h-full rounded-full opacity-30"
                          style={{ width: `${prevCatPct}%`, backgroundColor: result.color }}
                        />
                      )}
                      {/* 현재 결과 */}
                      <motion.div
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{ backgroundColor: catPct > 60 ? result.color : "oklch(0.55 0.12 250)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${catPct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 이전 결과 등급 */}
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
              <span>이전 결과 등급: <strong>{prevRecord.levelTitle}</strong></span>
              <span>현재 결과 등급: <strong style={{ color: result.color }}>{result.title}</strong></span>
            </div>

            {/* 점수 방향 해석 안내 */}
            <p className="text-xs text-muted-foreground mt-3 text-center">
              * 이 검사에서 점수가 <strong>높을수록</strong> 어려움이 많이 관찰됨을 의미합니다.
            </p>
          </motion.div>
        )}

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
                      style={{ backgroundColor: catPercentage > 60 ? result.color : "oklch(0.55 0.12 250)" }}
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
            <p className="text-sm text-foreground leading-relaxed">{result.recommendation}</p>
          </div>
        </motion.div>

        {/* Support Resources */}
        {(result.level === "moderate" || result.level === "high") && (
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
                      <a href={`tel:${resource.phone}`} className="text-xs text-primary font-medium mt-1 inline-block">{resource.phone}</a>
                    )}
                    {resource.url && (
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-medium mt-1 inline-block">방문하기 →</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Feedback Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="bg-card rounded-2xl border border-border/50 px-6 mb-6"
        >
          <FeedbackWidget testType={type} resultLevel={result.level} />
        </motion.div>

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
        <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
          <Button
            onClick={handleDownloadPdf}
            disabled={isPdfLoading}
            className="w-full sm:w-auto bg-primary text-primary-foreground gap-2"
          >
            {isPdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isPdfLoading ? "PDF 생성 중..." : "상세 리포트 PDF 저장"}
          </Button>
          <Link href={type === "adult" ? "/test/adult" : "/test/child"}>
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <RotateCcw className="w-4 h-4" /> 다시 검사하기
            </Button>
          </Link>
          <Link href="/info">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <BookOpen className="w-4 h-4" /> 경계선 지능 알아보기
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
