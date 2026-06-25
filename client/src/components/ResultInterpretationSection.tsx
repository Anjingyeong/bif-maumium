import { ClipboardCheck, Compass, ListChecks } from "lucide-react";
import type { InterpretationReport } from "@/lib/reportInterpretation";

interface ResultInterpretationSectionProps {
  readonly report: InterpretationReport;
  readonly accentColor: string;
}

const trendStyles = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  middle: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-rose-50 text-rose-700 border-rose-200",
} as const;

export function ResultInterpretationSection({ report, accentColor }: ResultInterpretationSectionProps) {
  return (
    <section className="bg-card rounded-2xl border border-border/60 shadow-sm p-6 md:p-8 mb-8">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0">
          <ClipboardCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-medium text-primary mb-1">{report.typeLabel} · {report.responseDate}</p>
          <h2 className="text-lg font-serif font-bold text-foreground">{report.title}</h2>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">{report.guideText}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 mb-5">
        <SummaryTile label="총점" value={report.scoreText} />
        <SummaryTile label="해석 단계" value={report.stageLabel} accentColor={accentColor} />
        <SummaryTile label="요약" value={report.oneLineSummary} />
      </div>

      <div className="rounded-xl border border-border/50 bg-secondary/30 p-4 mb-5">
        <div className="flex items-start gap-2">
          <Compass className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-foreground leading-relaxed">{report.responsePattern}</p>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <ListChecks className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">영역별 경향 분석</h3>
        </div>
        <div className="grid gap-3">
          {report.categoryInsights.map((item) => (
            <article key={item.category} className="rounded-xl border border-border/50 bg-background/70 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{item.category}</h4>
                  <p className="text-xs text-muted-foreground">{item.score}/{item.max}점 · {item.percentage}%</p>
                </div>
                <span className={`w-fit rounded-full border px-2.5 py-1 text-[11px] font-semibold ${trendStyles[item.trend]}`}>
                  {item.trendLabel}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.percentage}%`, backgroundColor: item.trend === "high" ? accentColor : "oklch(0.55 0.10 240)" }}
                />
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed mb-2">{item.interpretation}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">확인 포인트: </span>
                {item.checkPoint}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
        <p className="text-sm font-semibold text-foreground mb-1">다음 행동 안내</p>
        <p className="text-sm text-foreground/85 leading-relaxed">{report.nextAction}</p>
      </div>
    </section>
  );
}

function SummaryTile({ label, value, accentColor }: { readonly label: string; readonly value: string; readonly accentColor?: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-background/70 p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-semibold leading-relaxed" style={accentColor ? { color: accentColor } : undefined}>
        {value}
      </p>
    </div>
  );
}
