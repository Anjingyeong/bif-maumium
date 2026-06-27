import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Brain, CheckCircle2, Heart, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEGAL_COPY } from "@/constants/legalCopy";
import { SERVICE_COPY } from "@/constants/serviceCopy";

type TestType = "adult" | "child";

interface StartTestModalProps {
  open: boolean;
  onClose: () => void;
  onStart: (type: TestType) => void;
}

const OPTIONS: Array<{
  type: TestType;
  title: string;
  description: string;
  icon: typeof Brain;
}> = [
  {
    type: "adult",
    title: "나를 위한 자가체크",
    description: "최근 생활에서 느낀 학습·인지·적응기능 어려움을 스스로 점검합니다.",
    icon: Brain,
  },
  {
    type: "child",
    title: "자녀를 위한 보호자 체크",
    description: "보호자가 관찰한 자녀의 학습, 인지, 사회적 판단, 일상 적응 모습을 살펴봅니다.",
    icon: Heart,
  },
];

export default function StartTestModal({ open, onClose, onStart }: StartTestModalProps) {
  const [selectedType, setSelectedType] = useState<TestType | null>(null);

  const handleClose = () => {
    setSelectedType(null);
    onClose();
  };

  const handleStart = () => {
    if (!selectedType) return;
    onStart(selectedType);
    setSelectedType(null);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="start-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            key="start-modal"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-card rounded-xl border border-border shadow-sm w-full max-w-2xl pointer-events-auto overflow-hidden flex flex-col"
              style={{ maxHeight: "calc(100dvh - 2rem)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">검사 시작 전 안내</p>
                    <h2 className="text-base font-semibold text-foreground">대상을 선택해 주세요</h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  aria-label="닫기"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-5 sm:px-6 py-5 overflow-y-auto">
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-5">
                  <p className="text-sm font-semibold text-foreground mb-2">확인해 주세요</p>
                  <ul className="space-y-2.5">
                    {[
                      SERVICE_COPY.SERVICE_DESC,
                      LEGAL_COPY.PRE_TEST_DISCLAIMER,
                      "응답은 최근 6개월~1년의 실제 생활 경험을 기준으로 선택해 주세요.",
                      "불안, 우울, ADHD, 수면 부족, 스트레스 등도 결과에 영향을 줄 수 있습니다.",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5" role="radiogroup" aria-label="검사 대상 선택">
                  {OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const selected = selectedType === option.type;
                    return (
                      <button
                        key={option.type}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setSelectedType(option.type)}
                        className={`text-left rounded-xl border p-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                          selected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border bg-background hover:border-primary/40 hover:bg-secondary/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{option.title}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-1">{option.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
                  <p className="text-xs text-muted-foreground">
                    대상을 선택하면 해당 검사 시작 안내로 이어집니다.
                  </p>
                  <Button
                    type="button"
                    className="gap-2 min-h-[44px]"
                    disabled={!selectedType}
                    onClick={handleStart}
                  >
                    검사 시작
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
