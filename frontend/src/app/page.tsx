import Link from "next/link";
import { JobCard, JobData } from "@/components/ui/job-card";

async function getStats() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/stats", { next: { revalidate: 60 } });
    if (!res.ok) return { total_jobs: "300+", total_companies: "50+", portals_integrated: "10+" };
    return await res.json();
  } catch (error) {
    return { total_jobs: "300+", total_companies: "50+", portals_integrated: "10+" };
  }
}

async function getLatestJobs(): Promise<JobData[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/jobs?limit=4", { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

export default async function HomePage() {
  const stats = await getStats();
  const latestJobs = await getLatestJobs();

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-xl pb-lg md:pt-32 md:pb-xl hero-gradient">
        <div className="max-w-7xl mx-auto px-md text-center relative z-10">
          <h1 className="font-sans text-5xl md:text-6xl font-bold mb-sm max-w-4xl mx-auto tracking-tight animate-fade-in">
            Every IT Job in Nepal, <span className="text-primary">In One Place.</span>
          </h1>
          <p className="font-sans text-lg text-on-surface-variant max-w-2xl mx-auto mb-lg">
            Aggregating career pages, LinkedIn, and top portals for the Nepalese tech ecosystem. Open-source and developer-first.
          </p>
          
          {/* Modern Search Bar */}
          <div className="max-w-3xl mx-auto mb-lg">
            <div className="glass-panel p-2 rounded-2xl flex flex-col md:flex-row items-stretch gap-2 shadow-2xl">
              <div className="grow flex items-center px-4 gap-3 bg-surface-container-low rounded-xl">
                <span className="material-symbols-outlined text-outline">search</span>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-sans py-4 outline-none placeholder:text-outline" 
                  placeholder="Search roles, tech, or companies..." 
                  type="text"
                />
              </div>
              <Link href="/jobs" className="bg-primary text-on-primary px-8 py-4 rounded-xl font-sans font-bold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
                Find My Next Role
              </Link>
            </div>
          </div>
          
          {/* Source Stats */}
          <div className="flex flex-wrap justify-center gap-md mt-lg">
            <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
              <span className="font-mono text-xs font-medium uppercase tracking-wider">{stats.total_companies} Career Pages Scraped</span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
              <span className="font-mono text-xs font-medium uppercase tracking-wider">{stats.total_jobs} Active Jobs</span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
              <span className="font-mono text-xs font-medium uppercase tracking-wider">{stats.portals_integrated} Portals Integrated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Role Grid */}
      <section className="py-xl bg-surface border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-md">
          <div className="flex flex-col md:flex-row justify-between items-end mb-lg">
            <div>
              <h2 className="font-sans text-3xl font-bold mb-2">Browse by Role</h2>
              <p className="text-on-surface-variant font-sans text-base">Optimized listings for specific engineering tracks.</p>
            </div>
            <Link className="text-primary font-mono text-sm font-medium flex items-center gap-1 group mt-4 md:mt-0" href="/jobs">
              View All <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            {/* Frontend */}
            <Link href="/jobs?q=frontend" className="group relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-low p-md hover:border-primary/50 transition-all cursor-pointer">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-9xl">code</span>
              </div>
              <span className="material-symbols-outlined text-primary mb-md block text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>code</span>
              <h3 className="font-sans text-2xl font-bold mb-1">Frontend</h3>
              <p className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">Active Positions</p>
            </Link>

            {/* Backend */}
            <Link href="/jobs?q=backend" className="group relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-low p-md hover:border-primary/50 transition-all cursor-pointer">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-9xl">database</span>
              </div>
              <span className="material-symbols-outlined text-primary mb-md block text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>database</span>
              <h3 className="font-sans text-2xl font-bold mb-1">Backend</h3>
              <p className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">Active Positions</p>
            </Link>

            {/* DevOps */}
            <Link href="/jobs?q=devops" className="group relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-low p-md hover:border-primary/50 transition-all cursor-pointer">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-9xl">cloud_done</span>
              </div>
              <span className="material-symbols-outlined text-primary mb-md block text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_done</span>
              <h3 className="font-sans text-2xl font-bold mb-1">DevOps</h3>
              <p className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">Active Positions</p>
            </Link>

            {/* Data Science */}
            <Link href="/jobs?q=data" className="group relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-low p-md hover:border-primary/50 transition-all cursor-pointer">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-9xl">analytics</span>
              </div>
              <span className="material-symbols-outlined text-primary mb-md block text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
              <h3 className="font-sans text-2xl font-bold mb-1">Data Science</h3>
              <p className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">Active Positions</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="py-xl bg-surface border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-md">
          <div className="flex flex-col md:flex-row justify-between items-end mb-lg">
            <div>
              <h2 className="font-sans text-3xl font-bold mb-2">Latest Jobs</h2>
              <p className="text-on-surface-variant font-sans text-base">Freshly added positions from our curated sources.</p>
            </div>
            <Link className="text-primary font-mono text-sm font-medium flex items-center gap-1 group mt-4 md:mt-0" href="/jobs">
              View All Jobs <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </div>
          <div className="space-y-4">
            {latestJobs.length > 0 ? (
              latestJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <p className="text-on-surface-variant text-center py-4">No jobs available right now.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
