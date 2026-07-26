import { AlertTriangle, CheckCircle, ChevronRight, Clock } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

type Run = { run: string; failed_count: number };
type Failure = { timestamp: string; source: string; source_type: string; error: string };

async function getRuns(): Promise<Run[]> {
  try {
    const res = await fetch(`${API}/api/scrape-logs`, { cache: "no-store" });
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
}

async function getFailures(run: string): Promise<Failure[]> {
  try {
    const res = await fetch(`${API}/api/scrape-logs/${run}`, { cache: "no-store" });
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
}

function parseRunDate(run: string) {
  // run = "scrape_20260724_101503"
  const m = run.match(/scrape_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/);
  if (!m) return run;
  return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}:${m[6]} UTC`;
}

export default async function ScrapeLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ run?: string }>;
}) {
  const { run: selectedRun } = await searchParams;
  const runs = await getRuns();
  const failures = selectedRun ? await getFailures(selectedRun) : [];

  return (
    <div className="max-w-5xl mx-auto px-6 pt-10 pb-xl">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-xs text-secondary uppercase tracking-widest mb-2">Internal</p>
        <h1 className="font-sans text-3xl font-bold text-on-surface mb-1">Scrape Logs</h1>
        <p className="text-on-surface-variant font-sans text-sm">Failed scrapes only. Each row is one scraper run.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Run list */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-outline-variant">
              <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">Runs</span>
            </div>
            {runs.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <CheckCircle size={20} className="text-secondary mx-auto mb-2" />
                <p className="font-sans text-sm text-on-surface-variant">No failed runs yet</p>
              </div>
            ) : (
              <ul>
                {runs.map((r) => {
                  const active = selectedRun === r.run;
                  return (
                    <li key={r.run}>
                      <a
                        href={`/scrape-logs?run=${r.run}`}
                        className={`flex items-center justify-between px-4 py-3 border-b border-outline-variant/50 hover:bg-surface-container-high transition-colors ${active ? "bg-surface-container-high border-l-2 border-l-primary" : ""}`}
                      >
                        <div className="min-w-0">
                          <p className="font-mono text-xs text-on-surface truncate">{parseRunDate(r.run)}</p>
                          <p className="font-sans text-xs text-error mt-0.5 flex items-center gap-1">
                            <AlertTriangle size={11} />
                            {r.failed_count} failure{r.failed_count !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <ChevronRight size={14} className="text-outline shrink-0 ml-2" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* Failure detail */}
        <div className="grow w-full min-w-0">
          {!selectedRun ? (
            <div className="bg-surface-container border border-outline-variant rounded-xl p-12 text-center">
              <Clock size={24} className="text-outline mx-auto mb-3" />
              <p className="font-sans text-sm text-on-surface-variant">Select a run to view its failures</p>
            </div>
          ) : failures.length === 0 ? (
            <div className="bg-surface-container border border-outline-variant rounded-xl p-12 text-center">
              <CheckCircle size={24} className="text-secondary mx-auto mb-3" />
              <p className="font-sans text-sm text-on-surface-variant">No failures recorded for this run</p>
            </div>
          ) : (
            <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-outline-variant flex items-center justify-between">
                <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
                  {parseRunDate(selectedRun)}
                </span>
                <span className="font-mono text-xs text-error">{failures.length} failed</span>
              </div>
              <ul className="divide-y divide-outline-variant/50">
                {failures.map((f, i) => (
                  <li key={i} className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={14} className="text-error shrink-0 mt-0.5" />
                      <div className="min-w-0 grow">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-sans text-sm font-semibold text-on-surface">{f.source}</span>
                          <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant border border-outline-variant">
                            {f.source_type}
                          </span>
                          <span className="font-mono text-xs text-on-surface-variant ml-auto">{f.timestamp}</span>
                        </div>
                        <p className="font-mono text-xs text-error/80 break-all">{f.error}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
