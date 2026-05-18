/**
 * ConsentModal - 검사 시작 전 면책 동의 및 데이터 수집 동의 모달
 * Design: Warm Guidance - clear, non-threatening consent flow
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, CheckCircle2, ChevronRight, X } from "lucide-react";

interface ConsentModalProps {
  open: boolean;
  testType: "adult" | "child";
  onAccept: (allowDataCollection: boolean) => void;
  onClose: () => void;
}

export default function ConsentModal({ open, testType, onAccept, onClose }: ConsentModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [allowData, setAllowData] = useState(true);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

  const handleReset = () => {
    setStep(1);
    setDisclaimerChecked(false);
    setAllowData(true);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleAccept = () => {
    onAccept(allowData);
    handleReset();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden flex flex-col"
              style={{ maxHeight: "calc(100dvh - 2rem)" }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {testType === "adult" ? "성인 자가체크" : "아동 선별검사"}
                    </p>
                    <h2 className="text-sm font-semibold text-foreground">검사 시작 전 안내</h2>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Step Indicator */}
              <div className="flex px-6 pt-4 gap-2">
                {[1, 2].map(s => (
                  <div
                    key={s}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      step >= s ? "bg-primary" : "bg-border"
                    }`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 py-5 overflow-y-auto flex-1"
                  >
                    {/* Warning notice */}
                    <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-5">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-800 mb-1">
                          진단 도구가 아닙니다
                        </p>
                        <p className="text-xs text-amber-700 leading-relaxed">
                          본 검사는 학습·인지·적응기능 어려움과 경계선 지능 가능성을 <strong>선별</strong>하는 참고 자료입니다.
                          정확한 평가는 표준화 지능검사(K-WAIS/K-WISC), 적응행동검사, 면담을 통해 받으시기 바랍니다.
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {[
                        "검사 결과는 전문기관의 표준화 평가를 대체하지 않습니다.",
                        "결과에 따른 의사결정(치료, 교육 등)은 반드시 전문가와 상담 후 진행하세요.",
                        "검사 결과가 높더라도 주의력, 정서, 수면, 학습 문제 등 다른 요인을 함께 확인해야 합니다.",
                        "검사 결과가 낮더라도 전문가 상담이 필요할 수 있습니다.",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-xs text-muted-foreground leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Checkbox */}
                    <label className="flex items-start gap-3 p-3 rounded-xl border border-border bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={disclaimerChecked}
                        onChange={e => setDisclaimerChecked(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-primary cursor-pointer"
                      />
                      <span className="text-xs text-foreground leading-relaxed">
                        위 내용을 모두 읽고 이해했으며, 본 검사가 진단 도구가 아니라 선별용 자가체크임을 동의합니다.
                      </span>
                    </label>

                    <Button
                      className="w-full mt-4 gap-2"
                      disabled={!disclaimerChecked}
                      onClick={() => setStep(2)}
                    >
                      다음 <ChevronRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 py-5 overflow-y-auto flex-1"
                  >
                    <div className="flex gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 mb-5">
                      <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">
                          익명 데이터 수집 동의 (선택)
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          서비스 개선을 위해 <strong>익명의 응답 데이터</strong>를 수집합니다.
                          개인 식별 정보는 일절 수집하지 않으며, 수집된 데이터는 검사 신뢰도 향상 연구에만 활용됩니다.
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-2.5 mb-5">
                      {[
                        { label: "수집 항목", value: "문항별 응답값, 총점, 검사 유형" },
                        { label: "수집 제외", value: "이름, 연락처, IP주소 등 개인 식별 정보" },
                        { label: "활용 목적", value: "문항 신뢰도 분석 및 서비스 개선" },
                        { label: "보관 기간", value: "수집 후 2년, 이후 자동 삭제" },
                      ].map(item => (
                        <li key={item.label} className="flex gap-2 text-xs">
                          <span className="text-muted-foreground shrink-0 w-20">{item.label}</span>
                          <span className="text-foreground">{item.value}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/30 mb-4">
                      <span className="text-xs text-foreground font-medium">익명 데이터 수집에 동의합니다</span>
                      <button
                        onClick={() => setAllowData(v => !v)}
                        className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 ${
                          allowData ? "bg-primary" : "bg-border"
                        }`}
                        style={{ height: "22px", width: "40px" }}
                        role="switch"
                        aria-checked={allowData}
                      >
                        <span
                          className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform duration-200 ${
                            allowData ? "translate-x-5" : "translate-x-0.5"
                          }`}
                          style={{ width: "18px", height: "18px", top: "2px" }}
                        />
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center mb-4">
                      동의하지 않아도 검사를 진행할 수 있습니다.
                    </p>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setStep(1)}
                      >
                        이전
                      </Button>
                      <Button
                        className="flex-1 bg-primary text-primary-foreground"
                        onClick={handleAccept}
                      >
                        검사 시작
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
