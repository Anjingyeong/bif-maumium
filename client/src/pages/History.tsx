/**
 * History Page - 검사 이력 및 점수 추이
 * Design: Warm Guidance - Editorial layout with data visualization
 * recharts LineChart + AreaChart for score trend
 */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  History as HistoryIcon,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  BarChart2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import { getHistory, clearHistory, formatDate, TestRecord } from "@/lib/history";
import { getRiskBadgeColor, getRiskBadgeLabel } from "@/lib/riskLevels";

const TYPE_LABEL: Record<string, string> = {
  adult: "성인 자가체크",
  child: "아동 선별검사",
};

const CATEGORY_LABEL: Record<string, string> = {
  learning: "학습",
  cognition: "인지",
  social: "사회성",
  emotion: "정서",
  executive: "실행기능",
  adaptation: "적응",
  language: "언어",
  attention: "주의집중",
  behavior: "행동",
};

function ScoreBadge({ level }: { level: string }) {
  const color = getRiskBadgeColor(level);
  const label = getRiskBadgeLabel(level);
  return (
    <span
      className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: `${color}20`, color }}
    >
      {label}
    </span>
  );
}

// 커스텀 툴팁
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}점
        </p>
      ))}
    </div>
  );
}

export default function History() {
  const [filter, setFilter] = useState<"all" | "adult" | "child">("all");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [records, setRecords] = useState<TestRecord[]>(() => getHistory());

  const filtered = useMemo(
    () => (filter === "all" ? records : records.filter((r) => r.type === filter)),
    [records, filter]
  );

  // 꺾은선 그래프용 데이터 (시간순 정렬)
  const chartData = useMemo(() => {
    return [...filtered]
      .reverse()
      .map((r, i) => ({
        name: `${i + 1}차`,
        date: formatDate(r.date),
        score: r.score,
        max: r.maxScore,
        pct: Math.round((r.score / r.maxScore) * 100),
        type: TYPE_LABEL[r.type],
        level: r.level,
      }));
  }, [filtered]);

  // 영역별 최근 평균 (최근 5회)
  const categoryAvg = useMemo(() => {
    const recent = filtered.slice(0, 5);
    if (!recent.length) return [];
    const totals: Record<string, { score: number; max: number; count: number }> = {};
    for (const r of recent) {
      for (const [key, val] of Object.entries(r.categoryScores)) {
        if (!totals[key]) totals[key] = { score: 0, max: 0, count: 0 };
        totals[key].score += val.score;
        totals[key].max += val.max;
        totals[key].count += 1;
      }
    }
    return Object.entries(totals).map(([key, val]) => ({
      key,
      label: CATEGORY_LABEL[key] ?? key,
      avg: Math.round((val.score / val.max) * 100),
    }));
  }, [filtered]);

  const handleClear = () => {
    clearHistory();
    setRecords([]);
    setShowClearConfirm(false);
  };

  const trend = useMemo(() => {
    if (chartData.length < 2) return null;
    const last = chartData[chartData.length - 1].pct;
    const prev = chartData[chartData.length - 2].pct;
    const diff = last - prev;
    return { diff, direction: diff > 0 ? "up" : diff < 0 ? "down" : "same" };
  }, [chartData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border/60 shadow-sm">
        <div className="container flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">홈으로</span>
          </Link>
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">내 검사 기록</span>
          </div>
          <div />
        </div>
      </header>

      <main className="container max-w-3xl py-8 md:py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
            내 검사 기록
          </h1>
          <p className="text-sm text-muted-foreground">
            모든 기록은 이 기기의 브라우저에만 저장됩니다. 개인 식별 정보는 수집되지 않습니다.
          </p>
        </motion.div>

        {records.length === 0 ? (
          /* 기록 없음 */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <HistoryIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm mb-6">아직 검사 기록이 없습니다.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/test/adult">
                <Button size="sm">성인 자가체크 시작</Button>
              </Link>
              <Link href="/test/child">
                <Button variant="outline" size="sm">아동 선별검사 시작</Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            {/* 필터 + 삭제 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                {(["all", "adult", "child"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                      filter === f
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f === "all" ? "전체" : f === "adult" ? "성인" : "아동"}
                  </button>
                ))}
              </div>
              {!showClearConfirm ? (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  기록 삭제
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-destructive">정말 삭제할까요?</span>
                  <button onClick={handleClear} className="text-xs font-semibold text-destructive hover:underline">삭제</button>
                  <button onClick={() => setShowClearConfirm(false)} className="text-xs text-muted-foreground hover:underline">취소</button>
                </div>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                해당 유형의 검사 기록이 없습니다.
              </div>
            ) : (
              <>
                {/* 점수 추이 그래프 */}
                {chartData.length >= 2 && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-8"
                  >
                    <div className="bg-card rounded-2xl border border-border/50 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-serif font-bold text-foreground flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          점수 추이
                        </h2>
                        {trend && (
                          <div className="flex items-center gap-1 text-xs font-semibold">
                            {trend.direction === "up" ? (
                              <><TrendingUp className="w-3.5 h-3.5 text-amber-500" /><span className="text-amber-600">+{trend.diff}%p 상승</span></>
                            ) : trend.direction === "down" ? (
                              <><TrendingDown className="w-3.5 h-3.5 text-green-500" /><span className="text-green-600">-{trend.diff}%p 하락</span></>
                            ) : (
                              <><Minus className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-muted-foreground">변화 없음</span></>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mb-4">
                        점수가 <strong>낮을수록</strong> 어려움이 적음을 의미합니다.
                      </p>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.15} />
                              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                          <Tooltip content={<CustomTooltip />} />
                          <ReferenceLine y={50} stroke="#f97316" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "주의", position: "right", fontSize: 10, fill: "#f97316" }} />
                          <Area
                            type="monotone"
                            dataKey="pct"
                            name="점수"
                            stroke="var(--color-primary)"
                            strokeWidth={2.5}
                            fill="url(#scoreGrad)"
                            dot={{ r: 4, fill: "var(--color-primary)", strokeWidth: 0 }}
                            activeDot={{ r: 6 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.section>
                )}

                {/* 영역별 평균 (최근 5회) */}
                {categoryAvg.length > 0 && filtered.length >= 2 && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8"
                  >
                    <div className="bg-card rounded-2xl border border-border/50 p-6">
                      <h2 className="text-base font-serif font-bold text-foreground mb-4 flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-primary" />
                        영역별 평균 (최근 {Math.min(filtered.length, 5)}회)
                      </h2>
                      <div className="space-y-3">
                        {categoryAvg.map(({ key, label, avg }) => (
                          <div key={key}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-foreground font-medium">{label}</span>
                              <span className="text-muted-foreground">{avg}%</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${avg}%` }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="h-full rounded-full"
                                style={{
                                  background: avg >= 60
                                    ? "#ef4444"
                                    : avg >= 40
                                    ? "#f97316"
                                    : avg >= 25
                                    ? "#eab308"
                                    : "#22c55e",
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.section>
                )}

                {/* 기록 목록 */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h2 className="text-base font-serif font-bold text-foreground mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    전체 기록 ({filtered.length}회)
                  </h2>
                  <div className="space-y-3">
                    {filtered.map((r, i) => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="bg-card rounded-xl border border-border/50 p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[48px]">
                            <p className="text-xl font-bold text-foreground">{r.score}</p>
                            <p className="text-[10px] text-muted-foreground">/{r.maxScore}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-foreground">{TYPE_LABEL[r.type]}</span>
                              <ScoreBadge level={r.level} />
                            </div>
                            <p className="text-xs text-muted-foreground">{formatDate(r.date)}</p>
                          </div>
                        </div>
                        <Link href={`/result?type=${r.type}&score=${r.score}&answers=${encodeURIComponent(JSON.stringify(Object.fromEntries(Object.keys(r.categoryScores).map((k, idx) => [String(idx + 1), r.categoryScores[k].score]))))}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            상세 보기
                          </Button>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              </>
            )}
          </>
        )}

        {/* 검사 시작 CTA */}
        {records.length > 0 && (
          <div className="mt-10 flex gap-3 justify-center">
            <Link href="/test/adult">
              <Button size="sm" className="gap-1.5">성인 자가체크 다시 하기</Button>
            </Link>
            <Link href="/test/child">
              <Button variant="outline" size="sm" className="gap-1.5">아동 선별검사 다시 하기</Button>
            </Link>
          </div>
        )}
      </main>

      <footer className="py-8 border-t border-border/50 mt-12">
        <div className="container">
          <p className="text-xs text-muted-foreground text-center">
            본 서비스는 진단 도구가 아니라 선별용 자가체크입니다. 정확한 평가는 반드시 전문기관을 통해 받으시기 바랍니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
