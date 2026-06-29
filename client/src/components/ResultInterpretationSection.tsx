import { ClipboardCheck, Compass, ListChecks, MessageCircleQuestion, Route } from "lucide-react";
import type { InterpretationReport } from "@/lib/reportInterpretation";

interface ResultInterpretationSectionProps {
  readonly report: InterpretationReport;
  readonly accentColor: string;
}

export function ResultInterpretationSection({ report, accentColor }: ResultInterpretationSectionProps) {
  return (
    <section className="bg-card rounded-xl border border-border/60 shadow-sm p-6 md:p-8 mb-8">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0">
          <ClipboardCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-medium text-primary mb-1">
            {report.typeLabel} · {report.responseDate}
          </p>
          <h2 className="text-lg font-serif font-bold text-foreground">{report.title}</h2>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">{report.guideText}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-background/75 p-4 mb-5" style={{ borderColor: `${accentColor}33` }}>
        <p className="text-xs font-semibold text-primary mb-1">현재 경향</p>
        <p className="text-base font-serif font-bold text-foreground leading-relaxed">{report.oneLineSummary}</p>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          {report.scoreText} · 진단 점수가 아닌 응답 경향 참고값입니다.
        </p>
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
          <h3 className="text-sm font-semibold text-foreground">도움이 필요할 수 있는 영역</h3>
        </div>
        <div className="grid gap-3">
          {report.supportFocusAreas.length > 0 ? (
            report.supportFocusAreas.map((item) => (
              <article key={item.category} className="rounded-xl border border-border/50 bg-background/70 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{item.category}</h4>
                    <p className="text-xs text-muted-foreground mt-1">문제 영역이 아니라, 도움 방향을 살펴볼 영역입니다.</p>
                  </div>
                  <span className="w-fit rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    {item.trendLabel}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">확인 포인트: </span>
                  {item.checkPoint}
                </p>
              </article>
            ))
          ) : (
            <article className="rounded-xl border border-border/50 bg-background/70 p-4">
              <h4 className="text-sm font-semibold text-foreground mb-1">현재는 두드러진 영역이 적어요</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                불편함이 반복되는 상황이 생기면 언제, 어디서, 어떤 도움이 필요했는지 간단히 기록해 보세요.
              </p>
            </article>
          )}
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Route className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">생활 속에서 시도해 볼 방법</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {report.supportStrategies.map((group) => (
            <article key={group.category} className="rounded-xl border border-primary/15 bg-primary/5 p-4">
              <p className="text-sm font-semibold text-foreground mb-2">{group.category}</p>
              <ul className="space-y-1.5">
                {group.strategies.map((strategy) => (
                  <li key={strategy} className="text-xs text-foreground/85 leading-relaxed">
                    {strategy}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-secondary/30 p-4 mb-4">
        <div className="flex items-start gap-2">
          <MessageCircleQuestion className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">전문기관 상담을 고려할 때</p>
            <p className="text-sm text-foreground/85 leading-relaxed">{report.consultationGuidance}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
        <p className="text-sm font-semibold text-foreground mb-1">다음 행동 안내</p>
        <p className="text-sm text-foreground/85 leading-relaxed mb-2">{report.nextAction}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{report.resultNotice}</p>
      </div>
    </section>
  );
}
