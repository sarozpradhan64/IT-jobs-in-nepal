import Link from "next/link";
import { Code, Database, Cloud, BarChart, Terminal, Briefcase, Network, ArrowRight, Sparkles } from "lucide-react";
import { JobData } from "@/components/ui/job-card";
import { HomeSearch } from "@/components/ui/home-search";
import { SectionTitle } from "@/components/ui/section-title";
import { HomeJobList } from "@/components/ui/home-job-list";

async function getStats() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/stats`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return { total_jobs: 0, total_companies: 0, portals_integrated: 0 };
    return await res.json();
  } catch {
    return { total_jobs: 0, total_companies: 0, portals_integrated: 0 };
  }
}

async function getRoleStats(): Promise<Record<string, number>> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/stats/roles`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

async function getLatestJobs(): Promise<JobData[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/jobs?limit=100`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

const ROLE_CARDS = [
  { href: "/jobs?category=frontend", label: "Frontend", icon: Code, desc: "React, Next.js, Vue, UI/UX" },
  { href: "/jobs?category=backend", label: "Backend", icon: Database, desc: "Python, Node, Java, Go, APIs" },
  { href: "/jobs?category=devops", label: "DevOps & Cloud", icon: Cloud, desc: "AWS, Docker, K8s, CI/CD" },
  { href: "/jobs?category=data-science", label: "Data & AI", icon: BarChart, desc: "Analytics, ML, AI Engineering" },
];

export default async function HomePage() {
  const [stats, latestJobs, roleCounts] = await Promise.all([
    getStats(),
    getLatestJobs(),
    getRoleStats(),
  ]);

  return (
    <>
      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

          <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.12] mb-6 text-white">
            Every IT Job in Nepal,{" "}
            <span className="text-secondary">
              In One Place.
            </span>
          </h1>

          <p className="font-sans text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Aggregating company career pages, LinkedIn, and top tech portals for
            Nepal&apos;s engineers, designers, and tech innovators. Open-source &amp; developer-first.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-10">
            <HomeSearch />
          </div>

          {/* Live Metrics Chips */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Briefcase, label: `${stats.total_jobs.toLocaleString()} Active Jobs` },
              { icon: Terminal,  label: `${stats.total_companies.toLocaleString()} Career Pages Tracked` },
              { icon: Network,   label: `${stats.portals_integrated} Portals Integrated` },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-[#0f172a] border border-white/10 px-4 py-2 rounded-full text-slate-300 shadow-sm"
              >
                <Icon size={14} className="text-secondary shrink-0" />
                <span className="font-mono text-xs font-medium tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by Role ───────────────────────────── */}
      <section className="py-16 border-t border-white/10 bg-[#020617]/50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <SectionTitle
              title="Browse by Role"
              subtitle="EXPLORE CATEGORIES"
              className="mb-0"
            />
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 text-secondary font-mono text-sm hover:text-white transition-colors group font-semibold uppercase tracking-wider"
            >
              <span>View All Roles</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ROLE_CARDS.map(({ href, label, icon: Icon, desc }) => (
              <Link
                key={label}
                href={href}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a] p-6 hover:border-primary/50 hover:bg-[#1e293b]/70 hover:-translate-y-1 transition-all duration-300 shadow-premium"
              >
                {/* Background watermark icon */}
                <div className="absolute -right-3 -bottom-3 opacity-[0.05] group-hover:opacity-[0.12] transition-opacity">
                  <Icon size={96} className="text-white" />
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#1e293b] border border-white/10 flex items-center justify-center mb-5 text-[#a78bfa] group-hover:border-primary/40 group-hover:bg-primary/20 transition-all shadow-inner">
                  <Icon size={24} className="transition-transform group-hover:scale-110" />
                </div>

                <h3 className="font-sans text-lg font-bold text-white mb-1 transition-colors group-hover:text-[#a78bfa]">
                  {label}
                </h3>
                <p className="text-xs text-slate-400 mb-3">{desc}</p>
                <div className="inline-flex items-center gap-1 font-mono text-xs text-slate-300 font-medium uppercase tracking-wider">
                  <span>{roleCounts[href.split("=")[1]] ?? 0} Open Positions</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 100 Jobs on Homepage ──────────────────────────────── */}
      <section className="py-20 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <SectionTitle
              title="Featured Tech Jobs in Nepal"
              subtitle="LATEST 100 OPPORTUNITIES"
              className="mb-0"
            />
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 text-secondary font-mono text-sm hover:text-white transition-colors group font-semibold uppercase tracking-wider"
            >
              <span>Explore All Jobs</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* 100 Jobs List Component with interactive category tabs */}
          <HomeJobList jobs={latestJobs} />
        </div>
      </section>

      {/* ── Community Banner / CTA ──────────────────────────────── */}
      <section className="py-16 border-t border-white/10 bg-[#020617] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0f172a] p-8 md:p-12 shadow-premium text-center">
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4">
                Want to list your company&apos;s career page?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8">
                IT Jobs Nepal scans company career pages every day. Add your company repository or portal via GitHub to reach thousands of top tech candidates in Nepal.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="https://github.com/sarozpradhan64/IT-jobs-in-nepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary hover:bg-[#7555e0] text-white font-semibold text-sm px-8 py-3.5 rounded-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 shadow-premium"
                >
                  Contribute on GitHub
                </Link>
                <Link
                  href="/companies"
                  className="bg-transparent border border-white/20 hover:border-secondary hover:text-secondary text-white font-semibold text-sm px-8 py-3.5 rounded-xl transition-all duration-300"
                >
                  Browse Tech Companies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
