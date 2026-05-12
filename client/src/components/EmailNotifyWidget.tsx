/**
 * EmailNotifyWidget
 * 전문가 자문 오픈 시 알림 받기 이메일 수집 컴포넌트
 * - localStorage에 이메일 저장 (bif_notify_email)
 * - 이미 등록한 경우 완료 상태 표시
 * - 이메일 형식 유효성 검사
 * - 등록 완료 시 풍성한 애니메이션: 파티클 폭죽, 체크마크 드로잉, 순차 등장
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Bell, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const STORAGE_KEY = "bif_notify_email";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 파티클 데이터 (색상, 위치, 방향 고정값으로 SSR-safe)
const PARTICLES = [
  { color: "#3b5bdb", x: -60, y: -80, rotate: 45,  delay: 0 },
  { color: "#f59e0b", x:  60, y: -90, rotate: -30, delay: 0.05 },
  { color: "#10b981", x: -90, y: -40, rotate: 120, delay: 0.1 },
  { color: "#f43f5e", x:  90, y: -50, rotate: -90, delay: 0.08 },
  { color: "#8b5cf6", x: -40, y: -110,rotate: 60,  delay: 0.15 },
  { color: "#06b6d4", x:  40, y: -100,rotate: -60, delay: 0.12 },
  { color: "#f59e0b", x: -110,y: -20, rotate: 150, delay: 0.18 },
  { color: "#3b5bdb", x:  110,y: -30, rotate: -120,delay: 0.06 },
  { color: "#10b981", x:   0, y: -120,rotate: 0,   delay: 0.2 },
  { color: "#f43f5e", x: -70, y: -60, rotate: 90,  delay: 0.14 },
  { color: "#8b5cf6", x:  70, y: -70, rotate: -45, delay: 0.09 },
  { color: "#06b6d4", x: -30, y: -95, rotate: 30,  delay: 0.17 },
];

function SuccessAnimation({ email }: { email: string }) {
  const controls = useAnimation();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    controls.start("visible");
  }, [controls]);

  return (
    <motion.div
      className="flex flex-col items-center text-center gap-4 py-4 relative"
      initial="hidden"
      animate={controls}
    >
      {/* 파티클 폭죽 */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-sm"
            style={{ backgroundColor: p.color, top: 0, left: 0 }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              x: p.x,
              y: p.y,
              opacity: [1, 1, 0],
              scale: [1, 1.2, 0.4],
              rotate: p.rotate,
            }}
            transition={{
              duration: 0.9,
              delay: p.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </div>

      {/* 체크마크 원 - 스케일 팝 + SVG 드로잉 */}
      <motion.div
        className="relative w-20 h-20 flex items-center justify-center"
        variants={{
          hidden: { scale: 0, opacity: 0 },
          visible: { scale: 1, opacity: 1 },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
      >
        {/* 배경 원 - 파동 효과 */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0] }}
          transition={{ duration: 1.2, delay: 0.3, repeat: 1 }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/10"
          animate={{ scale: [1, 1.7, 1], opacity: [0.4, 0, 0] }}
          transition={{ duration: 1.4, delay: 0.5, repeat: 1 }}
        />

        {/* 메인 원 */}
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
          {/* SVG 체크마크 드로잉 */}
          <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none">
            <motion.path
              d="M5 13l4 4L19 7"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            />
          </svg>
        </div>
      </motion.div>

      {/* 텍스트 - 순차 등장 */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ delay: 0.55, duration: 0.4 }}
      >
        <motion.p
          className="text-lg font-bold text-foreground"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ delay: 0.55 }}
        >
          알림 등록 완료! 🎉
        </motion.p>
        <motion.p
          className="text-sm text-muted-foreground mt-1.5 leading-relaxed"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ delay: 0.7 }}
        >
          <span className="font-semibold text-primary">{email}</span>으로<br />
          전문가 자문 서비스 오픈 시 가장 먼저 알려드릴게요.
        </motion.p>
      </motion.div>

      {/* 혜택 배지 - 순차 등장 */}
      <motion.div
        className="flex flex-wrap gap-2 justify-center"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.85 } },
        }}
      >
        {[
          { icon: "🎯", text: "조기 등록 할인 예정" },
          { icon: "🔔", text: "오픈 즉시 알림" },
          { icon: "🔒", text: "외부 미전송" },
        ].map((badge) => (
          <motion.span
            key={badge.text}
            className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full"
            variants={{
              hidden: { opacity: 0, scale: 0.8, y: 6 },
              visible: { opacity: 1, scale: 1, y: 0 },
            }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <span>{badge.icon}</span>
            {badge.text}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function EmailNotifyWidget() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(() => !!localStorage.getItem(STORAGE_KEY));
  const [registeredEmail, setRegisteredEmail] = useState(
    () => localStorage.getItem(STORAGE_KEY) || ""
  );

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
    await new Promise(res => setTimeout(res, 700));

    localStorage.setItem(STORAGE_KEY, email.trim());
    setRegisteredEmail(email.trim());
    setIsLoading(false);
    setIsDone(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6 md:p-8 overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {isDone ? (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SuccessAnimation email={registeredEmail} />
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
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
