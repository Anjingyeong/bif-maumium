/**
 * QuestionCard Component
 * Design: Calm & Trustworthy - 신뢰감 있는 상담 서비스 스타일
 * Improvements:
 * - Larger touch targets for mobile (min 56px height buttons)
 * - Selected state: border + tinted background (덜 무거운 선택 표시)
 * - Smooth slide animation between questions
 * - Visual feedback on selection (checkmark icon)
 */
import { motion } from "framer-motion";
import { Question, AnswerValue, answerOptions } from "@/lib/questions";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  currentAnswer?: AnswerValue;
  onAnswer: (questionId: number, value: AnswerValue) => void;
  index: number;
  total: number;
  direction?: number; // 1 = forward, -1 = backward
}

export default function QuestionCard({
  question,
  currentAnswer,
  onAnswer,
  index,
  total,
  direction = 1,
}: QuestionCardProps) {
  const remaining = total - index;
  const estimatedMinutes = Math.ceil(remaining * 0.2);

  return (
    <motion.div
      initial={{ opacity: 0, x: direction * 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -40 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden"
    >
      {/* Progress bar inside card */}
      <div className="h-1 bg-border/30">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((index + 1) / total) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="p-6 md:p-8">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-medium text-primary bg-primary/8 px-3 py-1.5 rounded-full border border-primary/15">
            {question.category}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>약 {estimatedMinutes}분 남음</span>
            </div>
            <span className="text-xs font-semibold text-foreground bg-secondary px-2.5 py-1 rounded-full">
              {index + 1}
              <span className="text-muted-foreground font-normal"> / {total}</span>
            </span>
          </div>
        </div>

        {/* Question text */}
        <p className="text-base md:text-lg font-medium text-foreground leading-relaxed mb-7">
          {question.text}
        </p>

        {/* Answer options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {answerOptions.map((option) => {
            const isSelected = currentAnswer === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onAnswer(question.id, option.value)}
                className={cn(
                  "relative flex items-center gap-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 border text-left",
                  "min-h-[56px] md:min-h-[52px]",
                  isSelected
                    ? "bg-primary/8 text-primary border-primary/50 ring-1 ring-primary/20"
                    : "bg-secondary/30 text-foreground border-border/50 hover:bg-secondary/60 hover:border-border active:scale-[0.99]"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-border/60 bg-background"
                  )}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                    </motion.div>
                  )}
                </div>
                <span className="flex-1 leading-snug">{option.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected feedback */}
        {currentAnswer !== undefined && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-muted-foreground text-center mt-5 flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-primary/60" />
            선택 완료 — 다음 문항으로 자동 이동합니다
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
