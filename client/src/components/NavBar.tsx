/**
 * NavBar - 반응형 네비게이션 바
 * - 데스크톱: 가로 메뉴
 * - 모바일: 햄버거 버튼 → 슬라이드 다운 드로어
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { History as HistoryIcon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavBarProps {
  onStartTest: (type: "adult" | "child") => void;
}

const NAV_LINKS = [
  { href: "/info",    label: "경계선 지능이란?" },
  { href: "/term-diff", label: "용어 차이" },
  { href: "/blog",    label: "정보 센터" },
  { href: "/history", label: "내 기록", icon: <HistoryIcon className="w-3.5 h-3.5" /> },
];

export default function NavBar({ onStartTest }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  // 라우트 변경 시 메뉴 닫기
  useEffect(() => { setOpen(false); }, [location]);

  // 메뉴 열릴 때 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-1.5 flex-shrink-0">
            <img
              src="/manus-storage/favicon-32_b4200aca.png"
              alt="마음이음 로고"
              className="w-7 h-7 object-contain"
            />
            <span className="font-serif font-semibold text-lg text-foreground">마음이음</span>
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <Button variant="outline" size="sm" onClick={() => onStartTest("adult")}>
              검사 시작
            </Button>
          </div>

          {/* 모바일 햄버거 버튼 */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="w-5 h-5 text-foreground" />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="w-5 h-5 text-foreground" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* 모바일 드로어 오버레이 */}
      <AnimatePresence>
        {open && (
          <>
            {/* 배경 딤 */}
            <motion.div
              key="overlay"
              className="fixed inset-0 z-40 bg-black/30 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />

            {/* 드로어 패널 */}
            <motion.div
              key="drawer"
              className="fixed top-16 left-0 right-0 z-40 bg-background border-b border-border shadow-xl md:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="container py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* 구분선 */}
                <div className="my-2 border-t border-border" />

                {/* 검사 시작 버튼들 */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: NAV_LINKS.length * 0.05 + 0.05 }}
                  className="flex flex-col gap-2 pb-2"
                >
                  <Button
                    className="w-full min-h-[48px] text-sm"
                    onClick={() => { setOpen(false); onStartTest("adult"); }}
                  >
                    성인 자가진단 시작
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full min-h-[48px] text-sm"
                    onClick={() => { setOpen(false); onStartTest("child"); }}
                  >
                    아동 선별검사 시작
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
