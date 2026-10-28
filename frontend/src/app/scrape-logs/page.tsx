import { AlertTriangle, CheckCircle, ChevronRight, Clock } from "lucide-react";
import { SectionTitle } from "@/components/ui/section-title";

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
    <div className="bg-[#020617] min-h-screen pb-20 relative">
      <div className="max-w-5xl mx-auto px-6 pt-10">
        {/* Header */}
        <div className="mb-10">
          <SectionTitle
            title="Scrape Logs & Diagnostics"
            subtitle="INTERNAL STATUS & HEALTH"
          />
          <p className="text-slate-300 font-sans text-sm -mt-4">
            Monitoring crawler activity and error runs for portals and career pages.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Run list */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-premium">
              <div className="px-5 py-3.5 border-b border-white/10 bg-[#1e293b]/40">
                <span className="font-mono text-xs text-secondary font-bold uppercase tracking-widest">
                  Scraper Runs
                </span>
              </div>
              {runs.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <CheckCircle size={22} className="text-secondary mx-auto mb-2" />
                  <p className="font-sans text-xs text-slate-400">All scraping runs healthy</p>
                </div>
              ) : (
                <ul className="divide-y divide-white/5">
                  {runs.map((r) => {
                    const active = selectedRun === r.run;
                    return (
                      <li key={r.run}>
                        <a
                          href={`/scrape-logs?run=${r.run}`}
                          className={`flex items-center justify-between px-4 py-3.5 hover:bg-[#1e293b]/50 transition-colors ${
                            active ? "bg-[#1e293b] border-l-2 border-l-secondary" : ""
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="font-mono text-xs text-white truncate font-medium">
                              {parseRunDate(r.run)}
                            </p>
                            <p className="font-sans text-[11px] text-amber-400 mt-0.5 flex items-center gap-1">
                              <AlertTriangle size={11} />
                              <span>{r.failed_count} failure{r.failed_count !== 1 ? "s" : ""}</span>
                            </p>
                          </div>
                          <ChevronRight size={14} className="text-slate-500 shrink-0 ml-2" />
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
              <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-12 text-center shadow-premium">
                <Clock size={28} className="text-secondary/60 mx-auto mb-3" />
                <p className="font-sans text-sm text-slate-300">Select a run to view its failures</p>
              </div>
            ) : failures.length === 0 ? (
              <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-12 text-center shadow-premium">
                <CheckCircle size={28} className="text-emerald-400 mx-auto mb-3" />
                <p className="font-sans text-sm text-slate-300">No failures recorded for this run</p>
              </div>
            ) : (
              <div className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-premium">
                <div className="px-5 py-3.5 border-b border-white/10 bg-[#1e293b]/40 flex items-center justify-between">
                  <span className="font-mono text-xs text-white uppercase tracking-wider font-semibold">
                    {parseRunDate(selectedRun)}
                  </span>
                  <span className="font-mono text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md">
                    {failures.length} failed
                  </span>
                </div>
                <ul className="divide-y divide-white/5">
                  {failures.map((f, i) => (
                    <li key={i} className="px-5 py-4 hover:bg-[#1e293b]/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                        <div className="min-w-0 grow">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="font-sans text-sm font-bold text-white">{f.source}</span>
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[#1e293b] text-slate-300 border border-white/10">
                              {f.source_type}
                            </span>
                            <span className="font-mono text-[11px] text-slate-500 ml-auto">{f.timestamp}</span>
                          </div>
                          <p className="font-mono text-xs text-red-300/90 break-all bg-[#020617]/50 p-2.5 rounded-lg border border-red-500/20">
                            {f.error}
                          </p>
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
    </div>
  );
}
