import Link from "next/link";
import { Building2, MapPin, Briefcase, Clock, ArrowUpRight } from "lucide-react";

export interface JobData {
  id: number;
  slug: string;
  title: string;
  location: string;
  employment_type: string;
  experience_level: string;
  salary?: string;
  description?: string;
  requirements?: string;
  posted_date: string;
  apply_url: string;
  remote_status: string;
  source_name: string;
  skills: { id: number; name: string }[];
  company: {
    id: number;
    slug: string;
    name: string;
    logo_url?: string;
    website?: string;
    overview?: string;
  };
}

export function JobCard({ job }: { job: JobData }) {
  const getRelativeTime = (dateStr: string) => {
    if (!dateStr) return "Recently";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Recently";
    const diffH = Math.abs(Date.now() - date.getTime()) / 36e5;
    if (diffH < 1) return "Just now";
    if (diffH < 24) return `${Math.floor(diffH)}h ago`;
    return `${Math.floor(diffH / 24)}d ago`;
  };

  const sourceName = job.source_name?.includes("CareerPage:")
    ? "Career Page"
    : job.source_name;

  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group relative flex h-full min-h-[195px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a] p-5 shadow-premium transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-premium-hover"
    >

      {/* Left accent bar on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-full scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-300" />

      <div>
        {/* Top Company & Time Row */}
        <div className="flex items-start justify-between gap-3 mb-3.5 relative z-10">
          <div className="flex min-w-0 items-center gap-3">
            {/* Company logo */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#1e293b] text-slate-200 font-bold text-sm shadow-inner transition-colors group-hover:border-white/20">
              {job.company?.logo_url ? (
                <img
                  src={job.company.logo_url}
                  alt={job.company.name}
                  className="h-full w-full object-contain p-1.5"
                  loading="lazy"
                />
              ) : (
                <span>{(job.company?.name || "IT").slice(0, 2).toUpperCase()}</span>
              )}
            </div>

            <div className="min-w-0">
              <p className="flex items-center gap-1.5 truncate font-sans text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                <Building2 size={12} className="shrink-0 text-slate-400" />
                {job.company?.name || "Company"}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 truncate font-mono text-[11px] text-slate-400">
                <Clock size={11} className="shrink-0 text-slate-500" />
                {getRelativeTime(job.posted_date)}
              </p>
            </div>
          </div>

          {/* View CTA Pill */}
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary group-hover:text-white tracking-wide">
            <span>View</span>
            <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>

        {/* Job Title */}
        <h4 className="line-clamp-2 font-sans text-base sm:text-lg font-bold leading-snug text-white transition-colors duration-200 group-hover:text-[#a78bfa] relative z-10">
          {job.title}
        </h4>

        {/* Meta details */}
        <div className="mt-3 flex flex-wrap gap-x-3.5 gap-y-1.5 text-xs text-slate-400 relative z-10">
          <span className="flex min-w-0 items-center gap-1.5">
            <MapPin size={12} className="shrink-0 text-slate-500" />
            <span className="truncate text-slate-300">{job.location || "Nepal"}</span>
            {job.remote_status && (
              <span className="shrink-0 capitalize text-slate-400 font-mono text-[11px]">
                ({job.remote_status})
              </span>
            )}
          </span>
          {job.employment_type && (
            <span className="flex items-center gap-1.5">
              <Briefcase size={12} className="shrink-0 text-slate-500" />
              <span className="capitalize text-slate-300">{job.employment_type.replace(/-/g, " ")}</span>
            </span>
          )}
        </div>
      </div>

      {/* Badges / Tech Stack Row */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-white/5 pt-3.5 relative z-10">
        {sourceName && (
          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-sans text-[11px] font-medium text-slate-300 tracking-wide">
            via {sourceName}
          </span>
        )}

        {(job.skills || []).slice(0, 3).map((skill) => (
          <span
            key={skill.id}
            className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-slate-300 transition-colors group-hover:border-white/20"
          >
            {skill.name}
          </span>
        ))}
        {(job.skills || []).length > 3 && (
          <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-slate-400">
            +{job.skills.length - 3}
          </span>
        )}
      </div>
    </Link>
  );
}
