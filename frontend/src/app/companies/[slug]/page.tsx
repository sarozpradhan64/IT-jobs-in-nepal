import Link from "next/link";
import { notFound } from "next/navigation";
import { JobCard, JobData } from "@/components/ui/job-card";
import { CompanyData } from "../page";

async function getCompanyDetails(slug: string): Promise<CompanyData | null> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/companies/${slug}`, {
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
      `http://127.0.0.1:8000/api/jobs?company_id=${companyId}&limit=100`,
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
    <div className="bg-surface-container-lowest min-h-screen pb-2xl">

      {/* ── Hero Banner ───────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-surface-container-low to-surface-container border-b border-outline-variant/20">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-md pt-lg pb-xl">
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-mono text-sm mb-lg transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            All Companies
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center gap-lg">
            {/* Logo */}
            <div className="w-24 h-24 shrink-0 rounded-2xl bg-surface flex items-center justify-center text-primary font-bold text-3xl border border-outline-variant/30 shadow-xl overflow-hidden">
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

            <div className="flex-1">
              <h1 className="font-sans text-4xl md:text-5xl font-bold mb-3 leading-tight">
                {company.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-mono text-sm transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">language</span>
                    Website
                  </a>
                )}
                {company.career_page && (
                  <a
                    href={company.career_page}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-mono text-sm transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">work</span>
                    Careers Page
                  </a>
                )}
              </div>
            </div>

            {/* Stats pill */}
            <div className="shrink-0 bg-primary/10 border border-primary/20 rounded-2xl px-6 py-4 text-center">
              <p className="font-sans text-3xl font-bold text-primary">{jobs.length}</p>
              <p className="font-mono text-xs text-on-surface-variant mt-1 uppercase tracking-wider">
                Open Roles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-md mt-xl flex flex-col md:flex-row gap-xl">

        {/* Sidebar: About */}
        <aside className="w-full md:w-72 shrink-0">
          <div className="sticky top-24 space-y-md">
            <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-lg">
              <h3 className="font-sans text-lg font-bold mb-3">About</h3>
              <div className="font-sans text-sm text-on-surface-variant leading-relaxed">
                {company.overview ? (
                  company.overview.split("\n").map((paragraph: string, idx: number) => (
                    <p key={idx} className="mb-3">{paragraph}</p>
                  ))
                ) : (
                  <p>No overview available for this company yet.</p>
                )}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-lg">
              <h3 className="font-sans text-lg font-bold mb-3">Quick Links</h3>
              <div className="space-y-3">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm font-sans text-on-surface-variant hover:text-primary transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-outlined text-sm">language</span>
                    </span>
                    Visit Website
                  </a>
                )}
                {company.career_page && (
                  <a
                    href={company.career_page}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm font-sans text-on-surface-variant hover:text-primary transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-outlined text-sm">work</span>
                    </span>
                    Careers Page
                  </a>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main: Job Listings */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-sans text-2xl font-bold">
              Open Positions
              <span className="ml-3 bg-primary/10 text-primary px-3 py-1 rounded-full font-mono text-sm font-bold">
                {jobs.length}
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {jobs.length > 0 ? (
              jobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-xl text-center">
                <span className="material-symbols-outlined text-outline text-5xl mb-4 block">inbox</span>
                <h3 className="font-sans text-xl font-bold mb-2">No open roles right now</h3>
                <p className="text-on-surface-variant font-sans text-sm">
                  {company.name} doesn't have any active listings at the moment.
                  Check back later or browse all companies.
                </p>
                <Link
                  href="/companies"
                  className="mt-6 inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-sans font-bold hover:opacity-90 transition-all"
                >
                  Browse Companies
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}
