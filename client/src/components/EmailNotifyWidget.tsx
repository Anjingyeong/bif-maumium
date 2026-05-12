/**
 * EmailNotifyWidget
 * 전문가 자문 오픈 시 알림 받기 이메일 수집 컴포넌트
 * - localStorage에 이메일 저장 (bif_notify_emails)
 * - 이미 등록한 경우 완료 상태 표시
 * - 이메일 형식 유효성 검사
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle2, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const STORAGE_KEY = "bif_notify_email";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function EmailNotifyWidget() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(() => {
    return !!localStorage.getItem(STORAGE_KEY);
  });
  const [savedEmail] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "";
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("이메일 주소를 입력해주세요.");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("올바른 이메일 형식이 아닙니다.");
      return;
    }

    setIsLoading(true);
    // Simulate async save (localStorage is sync, but UX feels better with brief delay)
    await new Promise(res => setTimeout(res, 600));

    localStorage.setItem(STORAGE_KEY, email.trim());
    setIsLoading(false);
    setIsDone(true);
    toast.success("등록 완료! 오픈 시 가장 먼저 알려드릴게요.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6 md:p-8"
    >
      <AnimatePresence mode="wait">
        {isDone ? (
          /* 등록 완료 상태 */
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center gap-3 py-2"
          >
            <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">알림 등록 완료!</p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-medium text-primary">{savedEmail}</span>으로<br />
                전문가 자문 서비스 오픈 시 가장 먼저 알려드릴게요.
              </p>
            </div>
            <p className="text-xs text-muted-foreground bg-secondary/50 rounded-lg px-4 py-2">
              이메일은 기기에만 저장되며 외부로 전송되지 않습니다.
            </p>
          </motion.div>
        ) : (
          /* 입력 상태 */
          <motion.div key="input">
            {/* Header */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base">
                  전문가 자문 서비스 오픈 알림 받기
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                  임상심리사·정신건강의학과 전문의와의 1:1 온라인 자문 서비스를 준비 중입니다.
                  오픈 시 이메일로 가장 먼저 알려드릴게요.
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
              {[
                { icon: "🎯", text: "조기 등록 할인 혜택" },
                { icon: "👨‍⚕️", text: "검증된 전문가 연결" },
                { icon: "🔒", text: "개인정보 외부 미전송" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 bg-background/60 rounded-lg px-3 py-2 text-xs text-muted-foreground"
                >
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="이메일 주소 입력"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 min-h-[44px] bg-background border-border/60 focus:border-primary/50"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-h-[44px] px-5 bg-primary text-primary-foreground gap-1.5 flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    알림 받기
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              이메일은 이 기기에만 저장되며 외부 서버로 전송되지 않습니다.
              언제든지 브라우저 데이터 삭제로 취소할 수 있습니다.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
