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
import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { Link } from "wouter";
import { adultQuestions, AnswerValue } from "@/lib/questions";
import QuestionCard from "@/components/QuestionCard";
import { motion } from "framer-motion";
import ConsentModal from "@/components/ConsentModal";
import { LEGAL_COPY } from "@/constants/legalCopy";

export default function AdultTest() {
  const [location, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [direction, setDirection] = useState(1);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [saveConsent, setSaveConsent] = useState(false);
  const [showConsent, setShowConsent] = useState(() => {
    return sessionStorage.getItem('maumium_test_notice_confirmed_session') !== 'true';
  });
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const questions = adultQuestions.questions;
  const answeredCount = Object.keys(answers).length;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const allAnswered = answeredCount === questions.length;
  const isLastQuestion = currentIndex === questions.length - 1;
  const canSubmit = allAnswered && (!saveConsent || nickname.trim().length > 0);

  // Estimated total time: ~12s per question
  const totalMinutes = Math.ceil(questions.length * 0.2);

  const resetTest = useCallback(() => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    setCurrentIndex(0);
    setAnswers({});
    setDirection(1);
    setNickname("");
    setEmail("");
    const anonymousConsent = localStorage.getItem('maumium_anonymous_result_consent') !== 'false';
    setSaveConsent(anonymousConsent);
    sessionStorage.removeItem('maumium_test_notice_confirmed_session');
  }, []);

  useEffect(() => {
    resetTest();
    setShowConsent(sessionStorage.getItem('maumium_test_notice_confirmed_session') !== 'true');
  }, [location, resetTest]);

  const handleConsentAccept = (allowDataCollection: boolean) => {
    sessionStorage.setItem('maumium_test_notice_confirmed_session', 'true');
    localStorage.setItem('maumium_anonymous_result_consent', allowDataCollection ? 'true' : 'false');
    setSaveConsent(allowDataCollection);
    setShowConsent(false);
  };

  const handleConsentClose = () => {
    setLocation('/');
  };

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
        saveConsent: saveConsent ? "true" : "false",
      });
      if (saveConsent) {
        params.set("nickname", nickname.trim());
        if (email.trim()) {
          params.set("email", email.trim());
        }
      }
      setLocation(`/result?${params.toString()}`);
      return currentAnswers;
    });
  }, [nickname, email, saveConsent, setLocation]);

  return (
    <div className="min-h-screen bg-background">
      <ConsentModal
        open={showConsent}
        testType="adult"
        onAccept={handleConsentAccept}
        onClose={handleConsentClose}
      />
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border/60 shadow-sm">
        <div className="container flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">홈으로</span>
          </Link>

          {/* Center: title + progress fraction */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1.5">
              <img src="/icons/maumium-icon-32.png" alt="" className="w-4 h-4 object-contain" />
              <span className="text-sm font-semibold text-foreground">성인 자가체크</span>
            </div>
            <span className="text-[11px] text-muted-foreground">
              {currentIndex + 1} / {questions.length}문항 · 약 {totalMinutes}분
            </span>
          </div>

          {/* Right: answered count badge */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-primary bg-primary/8 border border-primary/15 px-2.5 py-1 rounded-full">
              {answeredCount}/{questions.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-border/30">
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

        {isLastQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-xl border border-border/60 bg-card p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    결과 저장 선택
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    {LEGAL_COPY.PRIVACY_DISCLAIMER}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="adult-save-consent"
                    checked={saveConsent}
                    onCheckedChange={checked => setSaveConsent(checked === true)}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="adult-save-consent"
                    className="text-xs leading-relaxed text-foreground"
                  >
                    익명 닉네임과 검사 결과 저장에 동의합니다.
                  </Label>
                </div>

                {saveConsent && (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="adult-nickname" className="text-xs">
                        닉네임
                      </Label>
                      <Input
                        id="adult-nickname"
                        value={nickname}
                        onChange={event => setNickname(event.target.value)}
                        maxLength={40}
                        placeholder="예: 마음이음01"
                        className="min-h-[44px]"
                      />
                    </div>
                    
                    <div className="space-y-1.5 mt-3">
                      <Label htmlFor="adult-email" className="text-xs">
                        이메일 (선택)
                      </Label>
                      <Input
                        id="adult-email"
                        type="email"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        maxLength={255}
                        placeholder="결과 확인 또는 문의를 위한 이메일"
                        className="min-h-[44px]"
                      />
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                        이메일은 결과 확인 또는 문의 응대를 위해 선택적으로 수집됩니다. 입력하지 않아도 자가체크 이용이 가능합니다.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6 gap-3">
          <Button
            variant="outline"
            onClick={() => goTo(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="gap-2 min-h-[44px] px-5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">이전 문항</span>
            <span className="sm:hidden">이전</span>
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="gap-2 min-h-[44px] px-6 bg-primary text-primary-foreground font-semibold"
            >
              <span className="hidden sm:inline">응답을 마치고 결과 확인</span>
              <span className="sm:hidden">결과 확인</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => goTo(Math.min(questions.length - 1, currentIndex + 1))}
              className="gap-2 min-h-[44px] px-5"
            >
              <span className="hidden sm:inline">다음 문항</span>
              <span className="sm:hidden">다음</span>
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
            className="mt-5 flex items-center justify-center gap-2 text-sm text-primary bg-primary/6 rounded-xl py-3 px-4 border border-primary/15"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>모든 문항 완료! 마지막 문항에서 결과를 확인하세요.</span>
          </motion.div>
        )}
      </main>
    </div>
  );
}
