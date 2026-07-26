import Link from "next/link";
import { Code, Database, Cloud, BarChart, Terminal, Briefcase, Network, ArrowRight } from "lucide-react";
import { JobCard, JobData } from "@/components/ui/job-card";
import { HomeSearch } from "@/components/ui/home-search";

async function getStats() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/stats`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return { total_jobs: "300+", total_companies: "50+", portals_integrated: "10+" };
    return await res.json();
  } catch {
    return { total_jobs: "300+", total_companies: "50+", portals_integrated: "10+" };
  }
}

async function getLatestJobs(): Promise<JobData[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/jobs?limit=10`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

const ROLE_CARDS = [
  { href: "/jobs?category=frontend", label: "Frontend", icon: Code },
  { href: "/jobs?category=backend", label: "Backend", icon: Database },
  { href: "/jobs?category=devops", label: "DevOps", icon: Cloud },
  { href: "/jobs?category=data-science", label: "Data Science", icon: BarChart },
];

export default async function HomePage() {
  const stats = await getStats();
  const latestJobs = await getLatestJobs();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

          <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-on-surface">
            Every IT Job in Nepal,{" "}
            <span className="text-primary">In One Place.</span>
          </h1>

          <p className="font-sans text-lg text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
            Aggregating career pages, LinkedIn, and top portals for the Nepalese tech ecosystem.
            Open-source &amp; developer-first.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="glass-panel p-1.5 rounded-2xl flex flex-col md:flex-row items-stretch gap-1.5">
              <HomeSearch />
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Briefcase,  label: `${stats.total_jobs} Active Jobs` },
              { icon: Terminal,   label: `${stats.total_companies} Career Pages` },
              { icon: Network,    label: `${stats.portals_integrated} Portals` },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-surface-container border border-outline-variant px-4 py-2 rounded-full text-on-surface-variant"
              >
                <Icon size={14} className="text-primary shrink-0" />
                <span className="font-mono text-xs font-medium tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by Role ───────────────────────────── */}
      <section className="py-16 border-t border-outline-variant">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <p className="font-mono text-xs text-secondary uppercase tracking-widest mb-2">Explore</p>
              <h2 className="font-sans text-3xl font-bold text-on-surface">Browse by Role</h2>
            </div>
            <Link href="/jobs" className="flex items-center gap-1.5 text-primary font-mono text-sm hover:opacity-70 transition-opacity group">
              View All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {ROLE_CARDS.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="group relative overflow-hidden rounded-xl border border-outline-variant bg-surface-container p-6 hover:border-secondary/70 hover:bg-surface-container-high transition-all duration-200"
              >
                <div className="absolute -right-4 -bottom-4 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity">
                  <Icon size={96} className="text-on-surface" />
                </div>
                <Icon size={28} className="text-primary mb-5 block transition-colors group-hover:text-secondary" />
                <h3 className="font-sans text-lg font-bold text-on-surface mb-1 transition-colors group-hover:text-secondary">{label}</h3>
                <p className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">Active Positions</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Jobs ──────────────────────────────── */}
      <section className="py-16 border-t border-outline-variant">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <p className="font-mono text-xs text-secondary uppercase tracking-widest mb-2">Fresh</p>
              <h2 className="font-sans text-3xl font-bold text-on-surface">Latest Jobs</h2>
            </div>
            <Link href="/jobs" className="flex items-center gap-1.5 text-primary font-mono text-sm hover:opacity-70 transition-opacity group">
              View All Jobs <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {latestJobs.length > 0 ? (
              latestJobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <p className="text-on-surface-variant text-center py-12 font-sans md:col-span-2 lg:col-span-3">No jobs available right now.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
