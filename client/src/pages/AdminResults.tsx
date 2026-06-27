import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { ArrowLeft, BarChart3, Users, AlertCircle, Loader2, Lock } from "lucide-react";
import {
  getRiskBadgeColor,
  getRiskBadgeLabel,
  getRiskStatsBucket,
  type RiskLevelKey,
} from "@/lib/riskLevels";

type TestType = "adult" | "child";

interface AdminResult {
  readonly id: string;
  readonly nickname: string;
  readonly email?: string | null;
  readonly testType: TestType;
  readonly totalScore: number;
  readonly maxScore: number;
  readonly riskLevel: string;
  readonly riskTitle: string;
  readonly createdAt: string;
}

interface AdminResultsResponse {
  readonly results?: readonly AdminResult[];
  readonly error?: string;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const STAT_LEVELS: readonly RiskLevelKey[] = ["low", "caution", "consult"];

const STAT_ICONS: Record<RiskLevelKey, typeof BarChart3> = {
  low: BarChart3,
  caution: AlertCircle,
  consult: Users,
};

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ko-KR", { timeZone: "Asia/Seoul", hour12: false });
}

export default function AdminResults() {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem("bif_admin_token") || "");
  const [results, setResults] = useState<readonly AdminResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<RiskLevelKey | "all">("all");
  const [location] = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Load results automatically if token is already present in localStorage
  useEffect(() => {
    if (adminToken.trim()) {
      loadResults();
    }
  }, []);


  const stats = useMemo(() => {
    const counts: Record<RiskLevelKey, number> = { low: 0, caution: 0, consult: 0 };
    for (const result of results) {
      const bucket = getRiskStatsBucket(result.riskLevel);
      if (bucket) counts[bucket] += 1;
    }
    return { total: results.length, counts };
  }, [results]);

  const filteredResults = useMemo(() => {
    if (filter === "all") return results;
    return results.filter(result => getRiskStatsBucket(result.riskLevel) === filter);
  }, [results, filter]);

  const loadResults = async () => {
    const token = adminToken.trim();
    if (!token) {
      setErrorMessage("관리자 토큰을 입력해 주세요.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const endpoint = API_BASE_URL ? `${API_BASE_URL}/api/admin/results` : "/api/admin/results";
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = (await response.json().catch(() => ({}))) as AdminResultsResponse;

      if (!response.ok) {
        setErrorMessage(body.error || "응답 목록을 불러오지 못했습니다.");
        setIsAuthorized(false);
        return;
      }

      localStorage.setItem("bif_admin_token", token);
      setResults(body.results ?? []);
      setIsAuthorized(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "응답 목록을 불러오지 못했습니다.");
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border/60 rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-serif font-bold text-foreground">관리자 인증</h1>
            <p className="text-xs text-muted-foreground mt-1">대시보드 접근을 위해 관리자 보안 토큰을 입력해 주세요.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground" htmlFor="admin-token">
                보안 토큰
              </label>
              <input
                id="admin-token"
                type="password"
                value={adminToken}
                onChange={event => setAdminToken(event.target.value)}
                onKeyDown={e => e.key === "Enter" && loadResults()}
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary/50 transition-colors"
                placeholder="ADMIN_TOKEN을 입력하세요"
              />
            </div>
            <Button
              onClick={loadResults}
              disabled={isLoading}
              className="w-full min-h-[44px] gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />확인 중...</>
              ) : (
                "인증 및 진입"
              )}
            </Button>
            {errorMessage && (
              <div className="rounded-xl bg-destructive/5 border border-destructive/20 px-4 py-3">
                <p className="text-sm text-destructive">{errorMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border/60 shadow-sm">
        <div className="container flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">홈으로</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/admin/results" className={`text-sm font-medium transition-colors ${location === "/admin/results" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              응답 내역
            </Link>
            <Link href="/admin/subscriptions" className={`text-sm font-medium transition-colors ${location === "/admin/subscriptions" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              알림 신청 목록
            </Link>
          </div>
          <div />
        </div>
      </header>

      <main className="container max-w-5xl py-8 md:py-12">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <p className="text-xs font-medium text-primary bg-primary/8 px-3 py-1 rounded-full inline-flex mb-3 border border-primary/15">관리자</p>
          <h1 className="text-2xl font-serif font-bold text-foreground">응답 관리 대시보드</h1>
          <p className="text-sm text-muted-foreground mt-1">자가체크 응답 결과를 실시간으로 모니터링합니다.</p>
        </div>

        {/* 통계 카드 4개 */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          {/* 전체 */}
          <div className="rounded-xl border border-border/60 bg-card shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">전체 응답</p>
            </div>
            <p className="text-3xl font-serif font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground mt-1">명</p>
          </div>

          {/* 위험도별 카드 */}
          {STAT_LEVELS.map(level => {
            const color = getRiskBadgeColor(level);
            const Icon = STAT_ICONS[level];
            const pct = stats.total > 0 ? Math.round((stats.counts[level] / stats.total) * 100) : 0;
            return (
              <div key={level} className="rounded-xl border border-border/60 bg-card shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{getRiskBadgeLabel(level)}</p>
                </div>
                <p className="text-3xl font-serif font-bold" style={{ color }}>
                  {stats.counts[level]}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{pct}%</p>
              </div>
            );
          })}
        </section>

        {/* 응답 목록 테이블 */}
        <section className="bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-foreground">응답 목록</h2>
              {results.length > 0 && (
                <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                  조회 {filteredResults.length}건
                </span>
              )}
            </div>
            
            {/* 필터 버튼들 */}
            {results.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                <button
                  onClick={() => setFilter("all")}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors whitespace-nowrap border ${
                    filter === "all"
                      ? "bg-foreground text-background font-medium border-foreground shadow-sm"
                      : "bg-card text-muted-foreground border-border/60 hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  전체보기
                </button>
                {STAT_LEVELS.map(level => {
                  const color = getRiskBadgeColor(level);
                  const isSelected = filter === level;
                  return (
                    <button
                      key={level}
                      onClick={() => setFilter(level)}
                      className="text-xs px-3 py-1.5 rounded-full transition-colors whitespace-nowrap border"
                      style={isSelected ? {
                        backgroundColor: color,
                        color: "var(--primary-foreground)",
                        borderColor: color,
                      } : {
                        backgroundColor: "transparent",
                        color: "hsl(var(--muted-foreground))",
                        borderColor: "hsl(var(--border) / 0.6)",
                      }}
                    >
                      {getRiskBadgeLabel(level)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="bg-secondary/40 border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">제출 시각</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">닉네임</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">이메일</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">유형</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">점수</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">위험도</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result, i) => (
                  <tr
                    key={result.id}
                    className={`border-t border-border/40 hover:bg-secondary/20 transition-colors ${
                      i % 2 === 0 ? "" : "bg-secondary/10"
                    }`}
                  >
                    <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(result.createdAt)}
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-foreground">{result.nickname}</td>
                    <td className="px-5 py-3 text-sm text-foreground">
                      {result.email ? (
                        <span className="text-foreground">{result.email}</span>
                      ) : (
                        <span className="text-muted-foreground">미입력</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-xl">
                        {result.testType === "adult" ? "성인" : "아동"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-foreground font-medium">
                      {result.totalScore}
                      <span className="text-muted-foreground font-normal">/{result.maxScore}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: `${getRiskBadgeColor(result.riskLevel)}15`,
                          color: getRiskBadgeColor(result.riskLevel),
                          border: `1px solid ${getRiskBadgeColor(result.riskLevel)}25`,
                        }}
                      >
                        {getRiskBadgeLabel(result.riskLevel)}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredResults.length === 0 && results.length > 0 && (
                  <tr>
                    <td className="px-5 py-14 text-center text-muted-foreground text-sm" colSpan={5}>
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="w-8 h-8 text-muted-foreground/30" />
                        <span>해당 위험도의 응답이 없습니다.</span>
                      </div>
                    </td>
                  </tr>
                )}
                {results.length === 0 && (
                  <tr>
                    <td className="px-5 py-14 text-center text-muted-foreground text-sm" colSpan={5}>
                      <div className="flex flex-col items-center gap-2">
                        <BarChart3 className="w-8 h-8 text-muted-foreground/30" />
                        <span>조회된 응답이 없습니다.</span>
                        <span className="text-xs">토큰을 입력하고 응답 불러오기를 눌러주세요.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
