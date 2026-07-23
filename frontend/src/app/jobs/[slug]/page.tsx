import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Clock, ExternalLink, Building2, Briefcase, BarChart, Globe, Banknote, Code2, FileText, ListChecks, CheckCircle2, ArrowRight } from "lucide-react";
import { JobData } from "@/components/ui/job-card";

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
    <div className="flex-1 min-w-[130px] bg-surface-container rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="text-primary text-sm flex items-center justify-center">
          {icon}
        </div>
        <p className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className="font-sans font-semibold capitalize">{value}</p>
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
    <div className="bg-surface-container-lowest min-h-screen pb-2xl">
      <div className="max-w-7xl mx-auto px-md py-xl">
        {/* Back Link */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-mono text-sm mb-lg transition-colors"
        >
          <ArrowLeft className="text-sm" size={16} />
          Back to Job Board
        </Link>

        {/* ── Job Header Card ──────────────────────────── */}
        <div className="relative overflow-hidden bg-surface-container-low border border-outline-variant/20 rounded-2xl p-lg mb-xl">
          <div className="pointer-events-none absolute -top-12 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-lg">
            {/* Company logo + title */}
            <div className="flex items-start gap-md">
              <div className="w-16 h-16 shrink-0 rounded-xl bg-surface flex items-center justify-center text-primary font-bold text-xl border border-outline-variant/30 overflow-hidden shadow-md">
                {job.company.logo_url ? (
                  <img
                    src={job.company.logo_url}
                    alt={job.company.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{companyInitials}</span>
                )}
              </div>

              <div>
                <h1 className="font-sans text-3xl md:text-4xl font-bold mb-2 leading-tight">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Link
                    href={`/companies/${companySlug}`}
                    className="font-sans text-lg font-medium text-primary hover:underline"
                  >
                    {job.company.name}
                  </Link>
                  <span className="text-outline-variant hidden md:inline">
                    •
                  </span>
                  <div className="flex items-center gap-1 text-on-surface-variant font-mono text-sm">
                    <MapPin className="text-sm" size={16} />
                    {job.location}
                  </div>
                  <span className="text-outline-variant hidden md:inline">
                    •
                  </span>
                  <div className="flex items-center gap-1 text-on-surface-variant font-mono text-sm">
                    <Clock className="text-sm" size={16} />
                    {postedDate}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
              <a
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-on-primary px-8 py-3 rounded-xl font-sans font-bold hover:opacity-90 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
              >
                Apply Now
                <ExternalLink className="text-sm" size={16} />
              </a>
              <Link
                href={`/companies/${companySlug}`}
                className="border border-outline-variant/50 text-on-surface px-8 py-3 rounded-xl font-sans font-medium hover:bg-surface-variant transition-colors flex items-center justify-center gap-2"
              >
                <Building2 className="text-sm" size={16} />
                View Company
              </Link>
            </div>
          </div>

          {/* Meta Badges */}
          <div className="relative z-10 border-t border-outline-variant/20 mt-lg pt-lg flex flex-wrap gap-3">
            <BadgePill
              icon={<Briefcase size={16} />}
              label="Employment Type"
              value={job.employment_type?.replace("-", " ") ?? "Full Time"}
            />
            <BadgePill
              icon={<BarChart size={16} />}
              label="Experience"
              value={job.experience_level ?? "Mid"}
            />
            <BadgePill
              icon={<Globe size={16} />}
              label="Work Setup"
              value={remoteLabel[job.remote_status] ?? job.remote_status}
            />
            <BadgePill
              icon={<Banknote size={16} />}
              label="Salary"
              value={job.salary ?? "Not Disclosed"}
            />
          </div>
        </div>

        {/* ── Two Column Body ──────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-xl">
          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-xl">
            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <section className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-lg">
                <h2 className="font-sans text-xl font-bold mb-4 flex items-center gap-2">
                  <Code2 className="text-primary" size={24} />
                  Tech Stack & Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill: { id: number; name: string }) => (
                    <span
                      key={skill.id}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-full font-mono text-sm border border-primary/20 hover:bg-primary/20 transition-colors cursor-default"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Description */}
            <section className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-lg">
              <h2 className="font-sans text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="text-primary" size={24} />
                Job Description
              </h2>
              <div className="font-sans text-sm text-on-surface-variant leading-relaxed space-y-3">
                {job.description ? (
                  job.description
                    .split("\n")
                    .map((para: string, idx: number) =>
                      para.trim() ? <p key={idx}>{para}</p> : null,
                    )
                ) : (
                  <p>
                    No description provided. Please visit the company's website
                    for more details.
                  </p>
                )}
              </div>
            </section>

            {/* Requirements */}
            {job.requirements && (
              <section className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-lg">
                <h2 className="font-sans text-xl font-bold mb-4 flex items-center gap-2">
                  <ListChecks className="text-primary" size={24} />
                  Requirements
                </h2>
                <div className="font-sans text-sm text-on-surface-variant leading-relaxed space-y-3">
                  {job.requirements
                    .split("\n")
                    .map((line: string, idx: number) =>
                      line.trim() ? (
                        <div key={idx} className="flex gap-2">
                          <CheckCircle2 className="text-primary text-sm shrink-0 mt-0.5" size={16} />
                          <p>{line}</p>
                        </div>
                      ) : null,
                    )}
                </div>
              </section>
            )}

            {/* Apply CTA */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-sans text-lg font-bold mb-1">
                  Ready to apply?
                </h3>
                <p className="font-sans text-sm text-on-surface-variant">
                  Don't miss out — submit your application directly on the
                  company's site.
                </p>
              </div>
              <a
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 bg-primary text-on-primary px-8 py-3 rounded-xl font-sans font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
              >
                Apply Now
                <ExternalLink className="text-sm" size={16} />
              </a>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="sticky top-24 space-y-md">
              {/* Company Card */}
              <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-lg">
                <h3 className="font-sans text-lg font-bold mb-4">
                  About the Company
                </h3>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-surface flex items-center justify-center text-primary font-bold border border-outline-variant/30 overflow-hidden">
                    {job.company.logo_url ? (
                      <img
                        src={job.company.logo_url}
                        alt={job.company.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{companyInitials}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold">{job.company.name}</h4>
                    <Link
                      href={`/companies/${companySlug}`}
                      className="font-mono text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      View Profile
                      <ArrowRight className="text-xs" size={12} />
                    </Link>
                  </div>
                </div>

                <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-4">
                  {job.company.overview ??
                    "A growing tech company based in Nepal, delivering innovative software solutions."}
                </p>

                <div className="space-y-2">
                  {job.company.website && (
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-sans text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <Globe className="text-sm" size={16} />
                      {job.company.website
                        .replace(/^https?:\/\//, "")
                        .replace(/\/$/, "")}
                    </a>
                  )}
                </div>
              </div>

              {/* Related Jobs */}
              {relatedJobs.length > 0 && (
                <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-lg">
                  <h3 className="font-sans text-lg font-bold mb-4">
                    More from {job.company.name}
                  </h3>
                  <div className="space-y-3">
                    {relatedJobs.map((related) => (
                      <Link
                        key={related.id}
                        href={`/jobs/${related.slug}`}
                        className="block group p-3 rounded-xl hover:bg-surface-container-high transition-colors border border-transparent hover:border-outline-variant/20"
                      >
                        <p className="font-sans text-sm font-semibold group-hover:text-primary transition-colors line-clamp-1">
                          {related.title}
                        </p>
                        <p className="font-mono text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                          <MapPin className="text-xs" size={12} />
                          {related.location}
                        </p>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/companies/${companySlug}`}
                    className="mt-4 flex items-center gap-1 text-primary font-mono text-xs hover:underline"
                  >
                    View all roles
                    <ArrowRight className="text-xs" size={12} />
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
