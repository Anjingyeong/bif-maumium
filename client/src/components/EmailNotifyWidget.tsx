import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, Bell, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeEmail } from "@/lib/subscriptionApi";

type ValidationState = "idle" | "typing" | "valid" | "invalid";

interface ValidationResult {
  state: ValidationState;
  message: string;
}

function validateEmail(email: string): ValidationResult {
  const value = email.trim();
  if (!value) return { state: "idle", message: "" };
  if (!value.includes("@")) return { state: "typing", message: "이메일 주소에 @가 포함되어야 합니다." };

  const validPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!validPattern.test(value)) {
    return { state: "invalid", message: "이메일 주소 형식을 다시 확인해 주세요." };
  }

  return { state: "valid", message: "신청 가능한 이메일 주소입니다." };
}

function SuccessState({ email }: { email: string }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center gap-4 py-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-sm shadow-primary/25">
        <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
      </div>

      <div>
        <p className="text-lg font-bold text-foreground">알림 신청 완료</p>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
          <span className="font-semibold text-primary">{email}</span>
          <br />
          마음이음 오픈 및 주요 업데이트 알림 신청이 정상적으로 완료되었습니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {["오픈/업데이트 안내 신청", "알림 신청 완료"].map((text) => (
          <span
            key={text}
            className="bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full"
          >
            {text}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function EmailNotifyWidget() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validation = validateEmail(email);
  const showError = touched && validation.state === "invalid";
  const showSuccess = touched && validation.state === "valid";

  const inputBorderClass = !touched
    ? "border-border/60"
    : showError || submitError
    ? "border-destructive focus-visible:ring-destructive/30"
    : showSuccess
    ? "border-primary focus-visible:ring-primary/30"
    : "border-border/60";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setSubmitError(null);

    if (validation.state !== "valid") return;

    setIsLoading(true);

    const trimmedEmail = email.trim();
    const result = await subscribeEmail(trimmedEmail);

    if (result.ok) {
      setRegisteredEmail(trimmedEmail);
      setIsDone(true);
    } else {
      if (result.error === "invalid_email") {
        setSubmitError("올바른 이메일 주소 형식을 입력해 주세요.");
      } else {
        setSubmitError("서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6 md:p-8 overflow-hidden"
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
            <SuccessState email={registeredEmail} />
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base">오픈 알림과 업데이트 소식</h3>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                  마음이음의 정식 오픈 소식과 주요 업데이트를 받을 이메일을 등록하실 수 있습니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
              {["오픈 소식", "주요 업데이트", "오픈/업데이트 안내"].map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-2 bg-background/60 rounded-xl px-3 py-2 text-xs text-muted-foreground"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary/70" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Input
                    type="email"
                    placeholder="이메일 주소 입력"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSubmitError(null);
                      if (!touched && e.target.value.length > 0) setTouched(true);
                    }}
                    onBlur={() => {
                      if (email.length > 0) setTouched(true);
                    }}
                    className={`pl-9 pr-9 min-h-[44px] bg-background transition-colors duration-200 ${inputBorderClass}`}
                    disabled={isLoading}
                    autoComplete="email"
                  />

                  <AnimatePresence>
                    {(showError || submitError) && (
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
                    {showSuccess && !submitError && (
                      <motion.div
                        key="ok-icon"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-primary" />
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
                    <>
                      알림 신청
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>

              <AnimatePresence mode="wait">
                {(showError || showSuccess || submitError) && (
                  <motion.p
                    key={submitError ? "submit-error-msg" : showError ? "error-msg" : "success-msg"}
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-center gap-1.5 text-xs px-1 ${
                      showError || submitError ? "text-destructive" : "text-primary"
                    }`}
                  >
                    {showError || submitError ? (
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                    {submitError || validation.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>

            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              입력하신 이메일은 오픈 및 업데이트 안내를 위해 저장됩니다. 알림 신청 외 목적으로 사용하지 않으며, 언제든 수신을 원하지 않으면 안내 메일을 통해 중단할 수 있습니다.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
