/**
 * QuestionCard Component
 * Design: Warm Guidance - improved UX with progress, estimated time, mobile touch optimization
 * Improvements:
 * - Larger touch targets for mobile (min 52px height buttons)
 * - Estimated remaining time display
 * - Animated progress fraction (current/total)
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
  const estimatedMinutes = Math.ceil(remaining * 0.2); // ~12초/문항

  return (
    <motion.div
      initial={{ opacity: 0, x: direction * 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -40 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden"
    >
      {/* Card Header - progress bar inside card */}
      <div className="h-1 bg-border/40">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((index + 1) / total) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="p-6 md:p-8">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              {question.category}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>약 {estimatedMinutes}분 남음</span>
            </div>
            <span className="text-xs font-bold text-foreground bg-secondary px-2.5 py-1 rounded-full">
              {index + 1}
              <span className="text-muted-foreground font-normal"> / {total}</span>
            </span>
          </div>
        </div>

        {/* Question text */}
        <h3 className="text-lg md:text-xl font-medium text-foreground leading-relaxed mb-7">
          {question.text}
        </h3>

        {/* Answer options - 2 columns on desktop, 1 column on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {answerOptions.map((option) => {
            const isSelected = currentAnswer === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onAnswer(question.id, option.value)}
                className={cn(
                  // Base: large touch target, smooth transition
                  "relative flex items-center gap-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 border text-left",
                  // Mobile: min 52px height for comfortable touch
                  "min-h-[52px] md:min-h-[48px]",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]"
                    : "bg-secondary/40 text-foreground border-border/50 hover:bg-secondary hover:border-primary/30 active:scale-[0.98]"
                )}
              >
                {/* Selection indicator */}
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200",
                    isSelected
                      ? "border-primary-foreground bg-primary-foreground/20"
                      : "border-border/60"
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
                <span className="flex-1">{option.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected feedback */}
        {currentAnswer !== undefined && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-muted-foreground text-center mt-4"
          >
            선택 완료 — 다음 문항으로 자동 이동합니다
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
