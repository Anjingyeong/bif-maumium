import { motion } from "framer-motion";
import { Question, AnswerValue, answerOptions } from "@/lib/questions";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  currentAnswer?: AnswerValue;
  onAnswer: (questionId: number, value: AnswerValue) => void;
  index: number;
  total: number;
}

export default function QuestionCard({ question, currentAnswer, onAnswer, index, total }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
          {question.category}
        </span>
        <span className="text-xs text-muted-foreground">
          {index + 1} / {total}
        </span>
      </div>
      
      <h3 className="text-lg md:text-xl font-medium text-foreground leading-relaxed mb-6">
        {question.text}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {answerOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswer(question.id, option.value)}
            className={cn(
              "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border",
              currentAnswer === option.value
                ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]"
                : "bg-secondary/50 text-foreground border-border/50 hover:bg-secondary hover:border-primary/30"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
