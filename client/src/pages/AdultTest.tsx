/**
 * Adult Self-Assessment Test Page
 * Design: Step-by-step question flow with progress indicator
 */
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { adultQuestions, AnswerValue } from "@/lib/questions";
import QuestionCard from "@/components/QuestionCard";

export default function AdultTest() {
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const questions = adultQuestions.questions;
  const progress = (Object.keys(answers).length / questions.length) * 100;

  const handleAnswer = (questionId: number, value: AnswerValue) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    // Auto-advance after short delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }, 300);
  };

  const handleSubmit = () => {
    const totalScore = Object.values(answers).reduce<number>((sum, val) => sum + val, 0);
    const params = new URLSearchParams({
      type: 'adult',
      score: totalScore.toString(),
      answers: JSON.stringify(answers),
    });
    setLocation(`/result?${params.toString()}`);
  };

  const allAnswered = Object.keys(answers).length === questions.length;

  if (showDisclaimer) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-lg w-full bg-card rounded-2xl border border-border/50 p-8 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-serif font-bold text-foreground">검사 전 안내</h1>
          </div>
          
          <div className="space-y-4 mb-8">
            <p className="text-sm text-muted-foreground leading-relaxed">
              본 체크리스트는 경계선 지적 기능의 <strong className="text-foreground">선별 목적</strong>으로만 사용되며, 
              의학적 진단을 대체하지 않습니다.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              정확한 진단을 위해서는 정신건강의학과 또는 심리상담센터에서 
              <strong className="text-foreground">웩슬러 지능검사(K-WAIS)</strong>를 받으시기 바랍니다.
            </p>
            <div className="bg-secondary/50 rounded-xl p-4">
              <p className="text-xs text-muted-foreground">
                <strong>검사 정보</strong><br />
                대상: {adultQuestions.targetAge}<br />
                문항 수: {questions.length}문항<br />
                소요 시간: 약 5~7분
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              모든 응답은 브라우저에서만 처리되며, 외부 서버에 전송되거나 저장되지 않습니다.
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline" className="border-border">돌아가기</Button>
            </Link>
            <Button onClick={() => setShowDisclaimer(false)} className="flex-1 bg-primary text-primary-foreground">
              이해했습니다, 검사 시작
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

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
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">성인 자가진단</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {Object.keys(answers).length}/{questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-1" />
      </header>

      {/* Question Area */}
      <main className="container max-w-2xl py-8 md:py-12">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={questions[currentIndex].id}
            question={questions[currentIndex]}
            currentAnswer={answers[questions[currentIndex].id]}
            onAnswer={handleAnswer}
            index={currentIndex}
            total={questions.length}
          />
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> 이전
          </Button>

          {currentIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="bg-primary text-primary-foreground gap-1"
            >
              결과 보기 <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              className="gap-1"
            >
              다음 <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Question dots */}
        <div className="flex flex-wrap gap-1.5 justify-center mt-8">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                i === currentIndex
                  ? "bg-primary scale-125"
                  : answers[q.id] !== undefined
                  ? "bg-primary/40"
                  : "bg-border"
              }`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
