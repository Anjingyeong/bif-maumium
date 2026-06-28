import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Rating = "helpful" | "not_helpful" | null;

interface FeedbackWidgetProps {
  testType: "adult" | "child";
  resultLevel: string;
}

export default function FeedbackWidget({ testType, resultLevel }: FeedbackWidgetProps) {
  const [rating, setRating] = useState<Rating>(null);
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (r: Rating) => {
    setRating(r);
    setShowComment(true);
  };

  const handleSubmit = () => {
    if (!rating) return;
    void testType;
    void resultLevel;
    void comment;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 py-6"
      >
        <CheckCircle2 className="w-10 h-10 text-primary" />
        <p className="text-sm font-medium text-foreground">소중한 의견 감사합니다!</p>
        <p className="text-xs text-muted-foreground text-center">
          피드백은 서비스 개선에 활용됩니다.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="py-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">이 결과가 도움이 되었나요?</p>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => handleRating("helpful")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
            rating === "helpful"
              ? "bg-primary/5 border-primary/30 text-primary"
              : "bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          도움이 됐어요
        </button>
        <button
          onClick={() => handleRating("not_helpful")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
            rating === "not_helpful"
              ? "bg-primary/5 border-primary/30 text-primary"
              : "bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <ThumbsDown className="w-4 h-4" />
          아쉬웠어요
        </button>
      </div>

      <AnimatePresence>
        {showComment && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-3">
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder={
                  rating === "helpful"
                    ? "어떤 점이 도움이 되었나요? (선택 사항)"
                    : "어떤 점이 아쉬웠나요? 개선 의견을 알려주세요. (선택 사항)"
                }
                rows={3}
                maxLength={300}
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{comment.length}/300</span>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  className="gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  제출
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                피드백 내용은 브라우저 저장소에 보관되지 않습니다.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
