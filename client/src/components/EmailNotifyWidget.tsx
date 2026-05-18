/**
 * EmailNotifyWidget
 * 전문가 자문 오픈 시 알림 받기 이메일 수집 컴포넌트
 * - localStorage에 이메일 저장 (bif_notify_email)
 * - 이미 등록한 경우 완료 상태 표시
 * - 실시간 유효성 검사 + 친절한 에러 메시지
 * - 등록 완료 시 파티클 폭죽, 체크마크 드로잉, 순차 등장 애니메이션
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Bell, Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2 as CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "bif_notify_email";

// 유효성 검사 단계별 상태
type ValidationState = "idle" | "typing" | "valid" | "invalid";

interface ValidationResult {
  state: ValidationState;
  message: string;
}

function validateEmail(email: string): ValidationResult {
  if (!email) return { state: "idle", message: "" };

  // 입력 중 — @ 없으면 아직 타이핑 중으로 간주
  if (!email.includes("@")) {
    return { state: "typing", message: "이메일 주소에 '@'가 필요합니다." };
  }

  const [local, domain] = email.split("@");

  if (!local || local.length === 0) {
    return { state: "invalid", message: "'@' 앞에 아이디를 입력해주세요. (예: hong@gmail.com)" };
  }

  if (!domain) {
    return { state: "typing", message: "'@' 뒤에 도메인을 입력해주세요. (예: gmail.com)" };
  }

  if (!domain.includes(".")) {
    return { state: "typing", message: "도메인에 '.'이 필요합니다. (예: gmail.com)" };
  }

  const domainParts = domain.split(".");
  const tld = domainParts[domainParts.length - 1];

  if (!tld || tld.length < 2) {
    return { state: "typing", message: "올바른 도메인 형식을 입력해주세요. (예: .com, .kr)" };
  }

  // 특수문자 검사
  const validPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!validPattern.test(email)) {
    return { state: "invalid", message: "사용할 수 없는 문자가 포함되어 있습니다. 이메일 주소를 다시 확인해주세요." };
  }

  // 일반적인 오타 힌트
  const commonTypos: Record<string, string> = {
    "gamil.com": "gmail.com",
    "gmial.com": "gmail.com",
    "gmai.com": "gmail.com",
    "navar.com": "naver.com",
    "naver.co": "naver.com",
    "daurn.net": "daum.net",
    "daum.com": "daum.net",
    "kakao.co": "kakao.com",
  };
  if (commonTypos[domain]) {
    return {
      state: "invalid",
      message: `혹시 '@${commonTypos[domain]}' 을 입력하려 하셨나요?`,
    };
  }

  return { state: "valid", message: "올바른 이메일 형식입니다." };
}

// 파티클 데이터
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
            animate={{ x: p.x, y: p.y, opacity: [1, 1, 0], scale: [1, 1.2, 0.4], rotate: p.rotate }}
            transition={{ duration: 0.9, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>

      {/* 체크마크 원 */}
      <motion.div
        className="relative w-20 h-20 flex items-center justify-center"
        variants={{ hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
      >
        <motion.div className="absolute inset-0 rounded-full bg-primary/20"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0] }}
          transition={{ duration: 1.2, delay: 0.3, repeat: 1 }}
        />
        <motion.div className="absolute inset-0 rounded-full bg-primary/10"
          animate={{ scale: [1, 1.7, 1], opacity: [0.4, 0, 0] }}
          transition={{ duration: 1.4, delay: 0.5, repeat: 1 }}
        />
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
          <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none">
            <motion.path
              d="M5 13l4 4L19 7"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            />
          </svg>
        </div>
      </motion.div>

      {/* 텍스트 순차 등장 */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        transition={{ delay: 0.55, duration: 0.4 }}
      >
        <motion.p className="text-lg font-bold text-foreground"
          variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
          transition={{ delay: 0.55 }}
        >
          이메일 저장 완료
        </motion.p>
        <motion.p className="text-sm text-muted-foreground mt-1.5 leading-relaxed"
          variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
          transition={{ delay: 0.7 }}
        >
          <span className="font-semibold text-primary">{email}</span>으로<br />
          현재 이 브라우저에만 저장되어 있으며, 외부 서버로 전송되지 않았습니다.
        </motion.p>
      </motion.div>

      {/* 혜택 배지 순차 등장 */}
      <motion.div
        className="flex flex-wrap gap-2 justify-center"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.85 } } }}
      >
        {[
          { icon: "🔒", text: "외부 서버 미전송" },
          { icon: "💻", text: "브라우저에만 저장" },
          { icon: "✕", text: "언제든 삭제 가능" },
        ].map((badge) => (
          <motion.span
            key={badge.text}
            className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full"
            variants={{ hidden: { opacity: 0, scale: 0.8, y: 6 }, visible: { opacity: 1, scale: 1, y: 0 } }}
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
  const [touched, setTouched] = useState(false); // 한 번이라도 입력했는지
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(() => !!localStorage.getItem(STORAGE_KEY));
  const [registeredEmail, setRegisteredEmail] = useState(() => localStorage.getItem(STORAGE_KEY) || "");

  // 실시간 유효성 검사
  const validation = validateEmail(email);
  const showError = touched && (validation.state === "invalid" || (validation.state === "typing" && email.length > 3));
  const showSuccess = touched && validation.state === "valid";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!touched && e.target.value.length > 0) setTouched(true);
  };

  const handleBlur = () => {
    if (email.length > 0) setTouched(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!email.trim()) return;
    if (validation.state !== "valid") return;

    setIsLoading(true);
    await new Promise(res => setTimeout(res, 700));

    localStorage.setItem(STORAGE_KEY, email.trim());
    setRegisteredEmail(email.trim());
    setIsLoading(false);
    setIsDone(true);
  };

  // 입력 필드 테두리 색상
  const inputBorderClass = !touched
    ? "border-border/60"
    : showError
    ? "border-destructive focus:border-destructive"
    : showSuccess
    ? "border-emerald-500 focus:border-emerald-500"
    : "border-border/60";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6 md:p-8 overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {isDone ? (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <SuccessAnimation email={registeredEmail} />
          </motion.div>
        ) : (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            {/* Header */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base">전문가 자문 서비스 소식 받기</h3>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                  1:1 온라인 자문 서비스는 준비 중입니다. 관심 이메일은 현재 이 브라우저에만 저장됩니다.
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
              {[
                { icon: "💻", text: "브라우저 임시 저장" },
                { icon: "🔒", text: "외부 서버 미전송" },
                { icon: "✕", text: "데이터 삭제로 제거" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 bg-background/60 rounded-lg px-3 py-2 text-xs text-muted-foreground">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  {/* 왼쪽 아이콘 */}
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />

                  <Input
                    type="email"
                    placeholder="이메일 주소 입력"
                    value={email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`pl-9 pr-9 min-h-[44px] bg-background transition-colors duration-200 ${inputBorderClass}`}
                    disabled={isLoading}
                    autoComplete="email"
                  />

                  {/* 오른쪽 상태 아이콘 */}
                  <AnimatePresence>
                    {showError && (
                      <motion.div
                        key="err-icon"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <AlertCircle className="w-4 h-4 text-destructive" />
                      </motion.div>
                    )}
                    {showSuccess && (
                      <motion.div
                        key="ok-icon"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <CheckIcon className="w-4 h-4 text-emerald-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || (touched && validation.state !== "valid")}
                  className="min-h-[44px] px-5 bg-primary text-primary-foreground gap-1.5 flex-shrink-0 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>이메일 저장 <ArrowRight className="w-4 h-4" /></>
                  )}
                </Button>
              </div>

              {/* 에러 / 성공 메시지 */}
              <AnimatePresence mode="wait">
                {showError && (
                  <motion.p
                    key="error-msg"
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-1.5 text-xs text-destructive px-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    {validation.message}
                  </motion.p>
                )}
                {showSuccess && (
                  <motion.p
                    key="success-msg"
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1.5 text-xs text-emerald-600 px-1"
                  >
                    <CheckIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    {validation.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              현재 입력하신 이메일은 이 브라우저에만 임시 저장되며, 외부 서버로 전송되지 않습니다.
              저장된 정보는 브라우저 데이터 삭제로 언제든 제거할 수 있습니다.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
