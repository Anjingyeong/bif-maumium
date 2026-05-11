/**
 * Adult Self-Assessment Test Page
 * Design: Step-by-step question flow with progress indicator
 * Fix: Removed duplicate disclaimer screen (consent handled by ConsentModal in Home.tsx)
 * Fix: Score calculation uses functional update to avoid stale state bug
 */
import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { adultQuestions, AnswerValue } from "@/lib/questions";
import QuestionCard from "@/components/QuestionCard";

export default function AdultTest() {
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});

  const questions = adultQuestions.questions;
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;
  const allAnswered = answeredCount === questions.length;

  const handleAnswer = useCallback((questionId: number, value: AnswerValue) => {
    setAnswers(prev => {
      const next = { ...prev, [questionId]: value };
      return next;
    });
    // Auto-advance after short delay
    setTimeout(() => {
      setCurrentIndex(prev => {
        if (prev < questions.length - 1) return prev + 1;
        return prev;
      });
    }, 300);
  }, [questions.length]);

  const handleSubmit = useCallback(() => {
    // Use functional read to get latest answers at submit time
    setAnswers(currentAnswers => {
      const totalScore = Object.values(currentAnswers).reduce<number>((sum, val) => sum + val, 0);
      const params = new URLSearchParams({
        type: 'adult',
        score: totalScore.toString(),
        answers: JSON.stringify(currentAnswers),
      });
      setLocation(`/result?${params.toString()}`);
      return currentAnswers; // no state change, just read
    });
  }, [setLocation]);

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
            {answeredCount}/{questions.length}
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

        {/* All answered hint */}
        {allAnswered && currentIndex < questions.length - 1 && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-muted-foreground mt-4"
          >
            모든 문항에 답변하셨습니다. 마지막 문항으로 이동해 결과를 확인하세요.
          </motion.p>
        )}
      </main>
    </div>
  );
}
