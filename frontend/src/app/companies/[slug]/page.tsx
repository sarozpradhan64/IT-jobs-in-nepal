import Link from "next/link";
import { notFound } from "next/navigation";
import { JobCard, JobData } from "@/components/ui/job-card";
import { CompanyData } from "../page";
import { ArrowLeft, Globe, Briefcase, Inbox, ArrowRight } from "lucide-react";

async function getCompanyDetails(slug: string): Promise<CompanyData | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch company details");
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getCompanyJobs(companyId: number): Promise<JobData[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/jobs?company_id=${companyId}&limit=100`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch company jobs", error);
    return [];
  }
}

export default async function CompanyDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await getCompanyDetails(slug);

  if (!company) notFound();

  const jobs = await getCompanyJobs(company.id);

  const initials = company.name
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="bg-[#020617] min-h-screen pb-20 relative">

      {/* ── Hero Banner ───────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#0f172a] border-b border-white/10 shadow-premium">

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-10 pb-12">
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 text-secondary hover:text-white font-mono text-xs font-semibold uppercase tracking-wider mb-8 transition-colors group"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            <span>All Companies</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-8">
            {/* Logo */}
            <div className="w-24 h-24 shrink-0 rounded-2xl bg-[#1e293b] flex items-center justify-center text-secondary font-bold text-3xl border border-white/10 shadow-inner overflow-hidden">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.name}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
                {company.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-slate-300 hover:text-secondary transition-colors"
                  >
                    <Globe size={14} className="text-secondary" />
                    <span>Website</span>
                  </a>
                )}
                {company.career_page && (
                  <a
                    href={company.career_page}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-slate-300 hover:text-secondary transition-colors"
                  >
                    <Briefcase size={14} className="text-secondary" />
                    <span>Careers Page</span>
                  </a>
                )}
              </div>
            </div>

            {/* Stats pill */}
            <div className="shrink-0 bg-secondary/15 border border-secondary/30 rounded-2xl px-8 py-5 text-center shadow-sm">
              <p className="font-sans text-3xl font-extrabold text-secondary">{jobs.length}</p>
              <p className="font-mono text-xs text-slate-300 mt-1 uppercase tracking-wider font-semibold">
                Open Roles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 mt-12 flex flex-col lg:flex-row gap-8">

        {/* Sidebar: About */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-premium">
              <h3 className="font-sans text-base font-bold text-white mb-3 uppercase tracking-wider text-xs">
                About Company
              </h3>
              <div className="font-sans text-sm text-slate-300 leading-relaxed">
                {company.overview ? (
                  company.overview.split("\n").map((paragraph: string, idx: number) => (
                    <p key={idx} className="mb-3">{paragraph}</p>
                  ))
                ) : (
                  <p>Tech organization operating in Nepal with active developer opportunities.</p>
                )}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-premium">
              <h3 className="font-sans text-base font-bold text-white mb-4 uppercase tracking-wider text-xs">
                Official Links
              </h3>
              <div className="space-y-3">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm font-sans text-slate-300 hover:text-secondary transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-xl bg-[#1e293b] border border-white/5 flex items-center justify-center text-secondary group-hover:border-secondary/40 transition-colors">
                      <Globe size={15} />
                    </span>
                    <span>Visit Website</span>
                  </a>
                )}
                {company.career_page && (
                  <a
                    href={company.career_page}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm font-sans text-slate-300 hover:text-secondary transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-xl bg-[#1e293b] border border-white/5 flex items-center justify-center text-secondary group-hover:border-secondary/40 transition-colors">
                      <Briefcase size={15} />
                    </span>
                    <span>Careers Page</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main: Job Listings */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-sans text-2xl font-bold text-white">
              Open Positions
              <span className="ml-3 bg-secondary/15 text-secondary border border-secondary/30 px-3 py-0.5 rounded-full font-mono text-xs font-bold">
                {jobs.length}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {jobs.length > 0 ? (
              jobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-16 text-center xl:col-span-2 shadow-premium">
                <Inbox size={44} className="mx-auto text-secondary/60 mb-4 block" />
                <h3 className="font-sans text-xl font-bold text-white mb-2">No open roles right now</h3>
                <p className="text-slate-400 font-sans text-sm max-w-sm mx-auto mb-6">
                  {company.name} doesn&apos;t have any active listings at the moment.
                  Check back soon or explore other tech companies.
                </p>
                <Link
                  href="/companies"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-[#7555e0] text-white px-7 py-3 rounded-xl font-sans font-semibold text-sm transition-all shadow-premium"
                >
                  <span>Browse All Companies</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}
