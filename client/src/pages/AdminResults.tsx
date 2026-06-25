import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, BarChart3, Users, AlertCircle, Loader2 } from "lucide-react";
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
  const [adminToken, setAdminToken] = useState("");
  const [results, setResults] = useState<readonly AdminResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stats = useMemo(() => {
    const counts: Record<RiskLevelKey, number> = { low: 0, caution: 0, consult: 0 };
    for (const result of results) {
      const bucket = getRiskStatsBucket(result.riskLevel);
      if (bucket) counts[bucket] += 1;
    }
    return { total: results.length, counts };
  }, [results]);

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
        return;
      }

      setResults(body.results ?? []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "응답 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

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
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">응답 관리</span>
          </div>
          <div />
        </div>
      </header>

      <main className="container max-w-5xl py-8 md:py-12">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <p className="text-xs font-medium text-primary bg-primary/8 px-3 py-1 rounded-full inline-flex mb-3 border border-primary/15">관리자</p>
          <h1 className="text-2xl font-serif font-bold text-foreground">응답 관리 대시보드</h1>
          <p className="text-sm text-muted-foreground mt-1">관리자 토큰으로 인증 후 응답 데이터를 확인하세요.</p>
        </div>

        {/* 토큰 입력 */}
        <section className="bg-card border border-border/60 rounded-2xl shadow-sm p-5 md:p-6 mb-6">
          <label className="text-sm font-semibold text-foreground" htmlFor="admin-token">
            관리자 토큰
          </label>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">발급된 관리자 토큰을 입력하여 응답 목록을 불러옵니다.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="admin-token"
              type="password"
              value={adminToken}
              onChange={event => setAdminToken(event.target.value)}
              onKeyDown={e => e.key === "Enter" && loadResults()}
              className="min-h-[44px] flex-1 rounded-xl border border-input bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary/50 transition-colors"
              placeholder="ADMIN_TOKEN을 입력하세요"
            />
            <Button
              onClick={loadResults}
              disabled={isLoading}
              className="min-h-[44px] px-6 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />불러오는 중...</>
              ) : (
                "응답 불러오기"
              )}
            </Button>
          </div>
          {errorMessage && (
            <div className="mt-3 rounded-xl bg-destructive/5 border border-destructive/20 px-4 py-3">
              <p className="text-sm text-destructive">{errorMessage}</p>
            </div>
          )}
        </section>

        {/* 통계 카드 4개 */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          {/* 전체 */}
          <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center">
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
              <div key={level} className="rounded-2xl border border-border/60 bg-card shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
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
        <section className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">응답 목록</h2>
            {results.length > 0 && (
              <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                총 {results.length}건
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="bg-secondary/40 border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">제출 시각</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">닉네임</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">유형</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">점수</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">위험도</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, i) => (
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
                    <td className="px-5 py-3">
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
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
