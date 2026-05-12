/**
 * Adult Self-Assessment Test Page
 * Design: Warm Guidance - enhanced UX
 * Improvements:
 * - Rich progress header: "N번째 / 15문항 · 약 N분 소요"
 * - Directional slide animation (forward/backward)
 * - Auto-advance on answer (300ms delay)
 * - Back button always visible
 * - "결과 보기" button only on last question when all answered
 * - Mobile-optimized navigation buttons (larger tap targets)
 */
import { useState, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { adultQuestions, AnswerValue } from "@/lib/questions";
import QuestionCard from "@/components/QuestionCard";
import { motion } from "framer-motion";

export default function AdultTest() {
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [direction, setDirection] = useState(1);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const questions = adultQuestions.questions;
  const answeredCount = Object.keys(answers).length;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const allAnswered = answeredCount === questions.length;
  const isLastQuestion = currentIndex === questions.length - 1;

  // Estimated total time: ~12s per question
  const totalMinutes = Math.ceil(questions.length * 0.2);

  const goTo = useCallback((index: number) => {
    const dir = index > currentIndex ? 1 : -1;
    setDirection(dir);
    setCurrentIndex(index);
  }, [currentIndex]);

  const handleAnswer = useCallback((questionId: number, value: AnswerValue) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));

    // Clear any pending auto-advance
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);

    // Auto-advance to next question after 350ms
    autoAdvanceTimer.current = setTimeout(() => {
      setCurrentIndex(prev => {
        if (prev < questions.length - 1) {
          setDirection(1);
          return prev + 1;
        }
        return prev;
      });
    }, 350);
  }, [questions.length]);

  const handleSubmit = useCallback(() => {
    setAnswers(currentAnswers => {
      const totalScore = Object.values(currentAnswers).reduce<number>((sum, val) => sum + val, 0);
      const params = new URLSearchParams({
        type: 'adult',
        score: totalScore.toString(),
        answers: JSON.stringify(currentAnswers),
      });
      setLocation(`/result?${params.toString()}`);
      return currentAnswers;
    });
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="container flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">홈으로</span>
          </Link>

          {/* Center: title + progress fraction */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1.5">
              <img src="/manus-storage/favicon-32_b4200aca.png" alt="" className="w-4 h-4 object-contain" />
              <span className="text-sm font-semibold text-foreground">성인 자가진단</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1}번째 문항 · 총 {questions.length}문항 · 약 {totalMinutes}분
            </span>
          </div>

          {/* Right: answered count badge */}
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-primary/60" />
            <span className="text-xs font-medium text-muted-foreground">
              {answeredCount}/{questions.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-border/40">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-2xl py-6 md:py-10">

        {/* Question card with directional animation */}
        <AnimatePresence mode="wait" custom={direction}>
          <QuestionCard
            key={questions[currentIndex].id}
            question={questions[currentIndex]}
            currentAnswer={answers[questions[currentIndex].id]}
            onAnswer={handleAnswer}
            index={currentIndex}
            total={questions.length}
            direction={direction}
          />
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6 gap-3">
          <Button
            variant="outline"
            onClick={() => goTo(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="gap-2 min-h-[44px] px-5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>이전</span>
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="gap-2 min-h-[44px] px-6 bg-primary text-primary-foreground font-semibold"
            >
              결과 보기
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => goTo(Math.min(questions.length - 1, currentIndex + 1))}
              className="gap-2 min-h-[44px] px-5"
            >
              <span>다음</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Question dot navigation */}
        <div className="flex flex-wrap gap-2 justify-center mt-6">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => goTo(i)}
              title={`${i + 1}번 문항${answers[q.id] !== undefined ? " (답변 완료)" : ""}`}
              className={`transition-all duration-200 rounded-full ${
                i === currentIndex
                  ? "w-5 h-3 bg-primary"
                  : answers[q.id] !== undefined
                  ? "w-3 h-3 bg-primary/50"
                  : "w-3 h-3 bg-border hover:bg-border/70"
              }`}
            />
          ))}
        </div>

        {/* All answered nudge */}
        {allAnswered && !isLastQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 flex items-center justify-center gap-2 text-sm text-primary bg-primary/8 rounded-xl py-3 px-4 border border-primary/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>모든 문항 완료! 마지막 문항에서 결과를 확인하세요.</span>
          </motion.div>
        )}
      </main>
    </div>
  );
}
