import Link from "next/link";
import { Building2, MapPin, Briefcase, Clock } from "lucide-react";

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
    const date = new Date(dateStr);
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
      className="group relative flex h-full min-h-[190px] flex-col overflow-hidden rounded-xl border border-slate-700/80 bg-[#1b2536] p-4 shadow-sm shadow-black/20 transition-all duration-200 hover:border-secondary/70 hover:bg-[#202c3f] hover:shadow-lg hover:shadow-black/25"
    >
      {/* Left violet accent bar on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-secondary rounded-r-full scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-200" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {/* Company logo */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-600/80 bg-surface-variant text-violet-700 font-bold transition-colors group-hover:border-secondary/70">
            {job.company.logo_url ? (
              <img
                src={job.company.logo_url}
                alt={job.company.name}
                className="h-full w-full object-contain p-1.5"
              />
            ) : (
              <span className="text-xs">{job.company.name.slice(0, 2).toUpperCase()}</span>
            )}
          </div>

          <div className="min-w-0">
            <p className="flex items-center gap-1 truncate font-sans text-xs text-sky-200/85">
              <Building2 size={11} className="shrink-0 text-slate-400" />
              {job.company.name}
            </p>
            <p className="mt-0.5 flex items-center gap-1 truncate font-mono text-[11px] text-slate-300/85">
              <Clock size={10} className="shrink-0 text-slate-400" />
              {getRelativeTime(job.posted_date)}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-lg border border-violet-400/30 bg-violet-400/10 px-2.5 py-1 text-xs font-semibold text-violet-300 transition-colors group-hover:bg-secondary group-hover:text-on-secondary group-hover:border-secondary">
          View
        </span>
      </div>

      <div className="mt-4 min-w-0 grow">
        <h4 className="line-clamp-2 font-sans text-base font-bold leading-snug text-slate-50 transition-colors group-hover:text-secondary">
          {job.title}
        </h4>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-300">
          <span className="flex min-w-0 items-center gap-1">
            <MapPin size={11} className="shrink-0 text-slate-400" />
            <span className="truncate">{job.location}</span>
            <span className="shrink-0 capitalize text-slate-400/90">({job.remote_status})</span>
          </span>
          <span className="flex items-center gap-1">
            <Briefcase size={11} className="shrink-0 text-slate-400" />
            <span className="capitalize">{job.employment_type.replace(/-/g, " ")}</span>
          </span>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-700/70 pt-3">
        {sourceName && (
          <span className="rounded-md border border-amber-300/40 bg-amber-300/12 px-2 py-0.5 font-sans text-xs font-semibold text-amber-200">
            via {sourceName}
          </span>
        )}

        {job.skills.slice(0, 3).map((skill) => (
          <span key={skill.id} className="rounded-md border border-slate-600/80 bg-[#243147] px-2 py-0.5 font-mono text-xs text-slate-200">
            {skill.name}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="rounded-md border border-slate-600/80 bg-[#243147] px-2 py-0.5 font-mono text-xs text-slate-300">
            +{job.skills.length - 3}
          </span>
        )}
      </div>
    </Link>
  );
}
