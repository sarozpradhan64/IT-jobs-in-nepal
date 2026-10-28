import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Clock, ExternalLink, Building2, Briefcase, BarChart, Globe, Banknote, Code2, FileText, ListChecks, ArrowRight } from "lucide-react";
import { JobData } from "@/components/ui/job-card";
import { RichText } from "@/components/ui/rich-text";

async function getJobDetails(slug: string): Promise<JobData | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${slug}`,
      {
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch job details");
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getRelatedJobs(
  companyId: number,
  currentSlug: string,
): Promise<JobData[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/jobs?company_id=${companyId}&limit=4`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data)
      ? data.filter((j: JobData) => j.slug !== currentSlug).slice(0, 3)
      : [];
  } catch {
    return [];
  }
}

function BadgePill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex-1 min-w-[140px] bg-[#1e293b]/70 border border-white/5 rounded-xl p-3.5 shadow-sm">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="text-secondary text-sm flex items-center justify-center">
          {icon}
        </div>
        <p className="font-mono text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
          {label}
        </p>
      </div>
      <p className="font-sans font-bold capitalize text-white text-sm">{value}</p>
    </div>
  );
}

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobDetails(slug);

  if (!job) notFound();

  const relatedJobs = await getRelatedJobs(job.company.id, slug);

  const companyInitials = job.company.name
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const companySlug =
    job.company.slug ?? job.company.name.toLowerCase().replace(/\s+/g, "-");

  const postedDate = job.posted_date
    ? new Date(job.posted_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  const remoteLabel: Record<string, string> = {
    onsite: "On-site",
    remote: "Remote",
    hybrid: "Hybrid",
  };

  return (
    <div className="bg-[#020617] min-h-screen pb-20 relative">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Back Link */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-secondary hover:text-white font-mono text-xs font-semibold uppercase tracking-wider mb-8 transition-colors group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Job Board</span>
        </Link>

        {/* ── Job Header Card ──────────────────────────── */}
        <div className="relative overflow-hidden bg-[#0f172a] border border-white/10 rounded-2xl p-6 md:p-8 mb-8 shadow-premium">
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            {/* Company logo + title */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#1e293b] flex items-center justify-center text-secondary font-bold text-xl border border-white/10 overflow-hidden shadow-inner">
                {job.company.logo_url ? (
                  <img
                    src={job.company.logo_url}
                    alt={job.company.name}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <span>{companyInitials}</span>
                )}
              </div>

              <div>
                <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
                  <Link
                    href={`/companies/${companySlug}`}
                    className="font-sans font-bold text-secondary hover:text-white transition-colors"
                  >
                    {job.company.name}
                  </Link>
                  <span className="text-slate-600 hidden md:inline">•</span>
                  <div className="flex items-center gap-1.5 text-slate-300 font-mono text-xs">
                    <MapPin size={13} className="text-secondary" />
                    <span>{job.location}</span>
                  </div>
                  <span className="text-slate-600 hidden md:inline">•</span>
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-xs">
                    <Clock size={13} className="text-slate-500" />
                    <span>{postedDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
              <a
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary hover:bg-[#7555e0] text-white px-8 py-3 rounded-xl font-sans font-semibold hover:-translate-y-0.5 active:scale-95 transition-all duration-300 text-center flex items-center justify-center gap-2 text-sm shadow-premium"
              >
                <span>Apply Now</span>
                <ExternalLink size={15} />
              </a>
              <Link
                href={`/companies/${companySlug}`}
                className="border border-white/10 hover:border-secondary/40 text-slate-300 hover:text-white bg-[#1e293b]/60 px-6 py-3 rounded-xl font-sans font-medium transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Building2 size={15} className="text-secondary" />
                <span>View Company</span>
              </Link>
            </div>
          </div>

          {/* Meta Badges */}
          <div className="relative z-10 border-t border-white/10 mt-6 pt-6 flex flex-wrap gap-3">
            <BadgePill
              icon={<Briefcase size={15} />}
              label="Employment Type"
              value={job.employment_type?.replace("-", " ") ?? "Full Time"}
            />
            <BadgePill
              icon={<BarChart size={15} />}
              label="Experience"
              value={job.experience_level ?? "Mid Level"}
            />
            <BadgePill
              icon={<Globe size={15} />}
              label="Work Setup"
              value={remoteLabel[job.remote_status] ?? job.remote_status}
            />
            <BadgePill
              icon={<Banknote size={15} />}
              label="Salary"
              value={job.salary ?? "Negotiable"}
            />
          </div>
        </div>

        {/* ── Two Column Body ──────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-8">
            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <section className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-premium">
                <h2 className="font-sans text-xl font-bold mb-4 flex items-center gap-2.5 text-white">
                  <Code2 className="text-secondary" size={20} />
                  Tech Stack &amp; Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill: { id: number; name: string }) => (
                    <span
                      key={skill.id}
                      className="px-3.5 py-1.5 bg-white/5 text-slate-200 rounded-xl font-mono text-xs border border-white/10 hover:border-secondary/40 transition-colors cursor-default"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Description */}
            <section className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-premium">
              <h2 className="font-sans text-xl font-bold mb-4 flex items-center gap-2.5 text-white">
                <FileText className="text-secondary" size={20} />
                Job Description
              </h2>
              {job.description ? (
                <RichText text={job.description} />
              ) : (
                <p className="font-sans text-sm text-slate-400">
                  No detailed description provided. Please visit the company&apos;s career portal for full details.
                </p>
              )}
            </section>

            {/* Requirements */}
            {job.requirements && (
              <section className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-premium">
                <h2 className="font-sans text-xl font-bold mb-4 flex items-center gap-2.5 text-white">
                  <ListChecks className="text-secondary" size={20} />
                  Requirements &amp; Qualifications
                </h2>
                <RichText text={job.requirements} />
              </section>
            )}

            {/* Bottom Apply CTA Card */}
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-premium">
              <div>
                <h3 className="font-sans text-xl font-bold mb-1 text-white">
                  Ready to apply for this position?
                </h3>
                <p className="font-sans text-sm text-slate-300">
                  Submit your application directly on the official company portal.
                </p>
              </div>
              <a
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 bg-primary hover:bg-[#7555e0] text-white px-8 py-3 rounded-xl font-sans font-semibold hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center gap-2 text-sm shadow-premium"
              >
                <span>Apply on Portal</span>
                <ExternalLink size={15} />
              </a>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Company Card */}
              <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-premium">
                <h3 className="font-sans text-base font-bold text-white mb-4 uppercase tracking-wider text-xs">
                  About the Company
                </h3>

                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#1e293b] flex items-center justify-center text-secondary font-bold border border-white/10 overflow-hidden shadow-inner">
                    {job.company.logo_url ? (
                      <img
                        src={job.company.logo_url}
                        alt={job.company.name}
                        className="w-full h-full object-contain p-1.5"
                      />
                    ) : (
                      <span>{companyInitials}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-white text-base leading-snug">{job.company.name}</h4>
                    <Link
                      href={`/companies/${companySlug}`}
                      className="font-mono text-xs text-secondary hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>View Company Profile</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>

                <p className="font-sans text-xs text-slate-400 leading-relaxed mb-4">
                  {job.company.overview ??
                    "A tech innovator operating in Nepal, creating engineering opportunities for software professionals."}
                </p>

                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-secondary transition-colors"
                  >
                    <Globe size={13} className="text-secondary" />
                    <span>
                      {job.company.website
                        .replace(/^https?:\/\//, "")
                        .replace(/\/$/, "")}
                    </span>
                  </a>
                )}
              </div>

              {/* Related Jobs */}
              {relatedJobs.length > 0 && (
                <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-premium">
                  <h3 className="font-sans text-base font-bold text-white mb-4 uppercase tracking-wider text-xs">
                    More from {job.company.name}
                  </h3>
                  <div className="space-y-3">
                    {relatedJobs.map((related) => (
                      <Link
                        key={related.id}
                        href={`/jobs/${related.slug}`}
                        className="block group p-3 rounded-xl bg-[#1e293b]/40 hover:bg-[#1e293b] transition-all border border-transparent hover:border-secondary/40"
                      >
                        <p className="font-sans text-sm font-semibold text-white group-hover:text-secondary transition-colors line-clamp-1">
                          {related.title}
                        </p>
                        <p className="font-mono text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <MapPin size={11} className="text-secondary" />
                          <span>{related.location}</span>
                        </p>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/companies/${companySlug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-secondary font-mono text-xs hover:underline font-semibold"
                  >
                    <span>View all company openings</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
