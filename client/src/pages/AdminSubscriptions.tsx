import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Bell, AlertCircle, Loader2, Download, Mail, Lock } from "lucide-react";

interface Subscription {
  readonly email: string;
  readonly created_at: string;
}

interface AdminSubscriptionsResponse {
  readonly ok: boolean;
  readonly subscriptions?: readonly Subscription[];
  readonly error?: string;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ko-KR", { timeZone: "Asia/Seoul", hour12: false });
}

export default function AdminSubscriptions() {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem("bif_admin_token") || "");
  const [subscriptions, setSubscriptions] = useState<readonly Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [location] = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Load results automatically if token is already present in localStorage
  useEffect(() => {
    if (adminToken.trim()) {
      loadSubscriptions();
    }
  }, []);

  const loadSubscriptions = async () => {
    const token = adminToken.trim();
    if (!token) {
      setErrorMessage("관리자 토큰을 입력해 주세요.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const endpoint = API_BASE_URL ? `${API_BASE_URL}/api/admin/subscriptions` : "/api/admin/subscriptions";
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = (await response.json().catch(() => ({}))) as AdminSubscriptionsResponse;

      if (!response.ok) {
        setErrorMessage(body.error || "알림 신청 목록을 불러오지 못했습니다.");
        setIsAuthorized(false);
        return;
      }

      localStorage.setItem("bif_admin_token", token);
      setSubscriptions(body.subscriptions ?? []);
      setIsAuthorized(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "알림 신청 목록을 불러오지 못했습니다.");
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCsv = () => {
    if (subscriptions.length === 0) return;

    // CSV header
    const headers = ["email", "created_at"];
    
    // Convert rows
    const rows = subscriptions.map(sub => {
      // Escape CSV special characters
      const escape = (val: string) => {
        const clean = val.replace(/"/g, '""');
        if (clean.includes(",") || clean.includes('"') || clean.includes("\n") || clean.includes("\r")) {
          return `"${clean}"`;
        }
        return clean;
      };
      return [escape(sub.email), escape(sub.created_at)].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    
    // Add UTF-8 BOM
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    const today = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `maumium-subscriptions-${today}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border/60 rounded-2xl shadow-xl p-6 md:p-8">
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
                onKeyDown={e => e.key === "Enter" && loadSubscriptions()}
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary/50 transition-colors"
                placeholder="ADMIN_TOKEN을 입력하세요"
              />
            </div>
            <Button
              onClick={loadSubscriptions}
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
        {/* Page Title */}
        <div className="mb-8">
          <p className="text-xs font-medium text-primary bg-primary/8 px-3 py-1 rounded-full inline-flex mb-3 border border-primary/15">관리자</p>
          <h1 className="text-2xl font-serif font-bold text-foreground">오픈/업데이트 알림 신청 관리</h1>
          <p className="text-sm text-muted-foreground mt-1">사용자가 오픈/업데이트 알림 수신을 위해 신청한 이메일 주소 목록입니다.</p>

          {/* 알림 발송 연동 준비 중 배너 */}
          <div className="mt-4 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 text-blue-900 dark:text-blue-200 text-xs flex gap-2.5 items-start">
            <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">📧 알림 이메일 자동 발송 시스템 설계/준비 중</p>
              <p className="mt-1 leading-relaxed text-muted-foreground">
                이메일 발송 자동화 연동을 위한 백엔드 구조(provider 및 템플릿 코드)가 준비 단계에 있습니다.
                실제 대량 발송 서비스 연동은 도메인 DNS 인증 및 API 키 발급이 완료된 후 후속 작업으로 활성화될 예정입니다.
              </p>
            </div>
          </div>
        </div>

        {/* Subscriptions Table / Cards */}
        <section className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-foreground">신청자 목록</h2>
              {subscriptions.length > 0 && (
                <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                  총 {subscriptions.length}건
                </span>
              )}
            </div>
            
            {subscriptions.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={handleDownloadCsv}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 text-xs h-9"
                >
                  <Download className="w-3.5 h-3.5" />
                  CSV 다운로드
                </Button>
                <Button
                  disabled
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-1.5 text-xs h-9 opacity-50 cursor-not-allowed"
                >
                  <Mail className="w-3.5 h-3.5" />
                  메일 일괄 발송 (준비 중)
                </Button>
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/40 border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">이메일</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 w-56">신청 일시</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub, i) => (
                  <tr
                    key={sub.email + i}
                    className={`border-t border-border/40 hover:bg-secondary/20 transition-colors ${
                      i % 2 === 0 ? "" : "bg-secondary/10"
                    }`}
                  >
                    <td className="px-5 py-3 text-sm text-foreground font-medium break-all max-w-[500px]">
                      {sub.email}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(sub.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden divide-y divide-border/40">
            {subscriptions.map((sub, i) => (
              <div key={sub.email + i} className="p-4 flex flex-col gap-2 hover:bg-secondary/10 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-foreground break-all flex-1">{sub.email}</p>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground pl-7">
                  <span>신청 시각:</span>
                  <span>{formatDateTime(sub.created_at)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {subscriptions.length === 0 && (
            <div className="px-5 py-14 text-center text-muted-foreground text-sm">
              <div className="flex flex-col items-center gap-2">
                <Mail className="w-8 h-8 text-muted-foreground/30" />
                <span>알림 신청 내역이 없습니다.</span>
                <span className="text-xs">토큰을 입력하고 목록 불러오기를 눌러주세요.</span>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
