import Link from "next/link";
import { Building2, MapPin, Briefcase } from "lucide-react";

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
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="group bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 flex flex-col gap-5 hover:bg-surface-container hover:border-primary/40 hover:shadow-[0_0_20px_rgba(77,142,255,0.05)] transition-all duration-300 cursor-pointer relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between gap-5 w-full z-10">
        <div className="flex items-start md:items-center gap-4 grow min-w-0">
          <div className="w-14 h-14 bg-surface rounded-xl flex items-center justify-center font-bold text-primary border border-outline-variant/20 overflow-hidden shrink-0 group-hover:border-primary/40 group-hover:scale-105 transition-all duration-300">
            {job.company.logo_url ? (
              <img
                src={job.company.logo_url}
                alt={job.company.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold">
                {job.company.name.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          {/* Title + Meta */}
          <div className="grow min-w-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <h4 className="font-sans text-lg font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                <Link href={`/jobs/${job.slug}`}>{job.title}</Link>
              </h4>
              <Link
                href={`/jobs/${job.slug}`}
                className="bg-primary/10 text-primary hover:bg-primary hover:text-on-primary px-4 py-2 rounded-lg font-sans font-medium text-sm transition-colors whitespace-nowrap text-center hidden md:block border border-primary/20 hover:border-primary shrink-0"
              >
                View Details
              </Link>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
              <span className="font-sans text-sm text-on-surface-variant flex items-center gap-1.5">
                <Building2 size={14} className="text-outline shrink-0" />
                {job.company.name}
              </span>
              <span className="text-outline-variant/60 text-xs">•</span>
              <span className="font-sans text-sm text-on-surface-variant flex items-center gap-1.5">
                <MapPin size={14} className="text-outline shrink-0" />
                {job.location}
                <span className="text-outline text-xs">
                  ({job.remote_status})
                </span>
              </span>
              <span className="text-outline-variant/60 text-xs hidden sm:inline">
                •
              </span>
              <span className="font-sans text-sm text-on-surface-variant hidden sm:flex items-center gap-1.5 capitalize">
                <Briefcase size={14} className="text-outline shrink-0" />
                {job.employment_type.replace(/-/g, " ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: badges */}
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-outline-variant/20 z-10">
        {/* Time ago */}
        <span className="px-2.5 py-1 bg-surface border border-outline-variant/20 rounded-md text-xs font-mono text-on-surface-variant flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow shrink-0" />
          {getRelativeTime(job.posted_date)}
        </span>

        {/* Source */}
        {job.source_name && (
          <span className="px-2.5 py-1 bg-secondary-container text-on-secondary-container rounded-md text-xs font-sans font-medium capitalize whitespace-nowrap">
            via{" "}
            {job.source_name.includes("CareerPage:")
              ? "Career Page"
              : job.source_name}
          </span>
        )}

        <div className="w-px h-4 bg-outline-variant/30 mx-0.5 hidden sm:block shrink-0" />

        {/* Skills */}
        {job.skills.slice(0, 3).map((skill) => (
          <span
            key={skill.id}
            className="px-2.5 py-1 bg-surface-container-high text-on-surface-variant rounded-md text-xs font-mono border border-outline-variant/20"
          >
            {skill.name}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="px-2.5 py-1 bg-surface-container text-outline rounded-md text-xs font-mono border border-outline-variant/20">
            +{job.skills.length - 3}
          </span>
        )}
      </div>

      {/* Mobile: View Details button */}
      <Link
        href={`/jobs/${job.slug}`}
        className="bg-primary/10 text-primary hover:bg-primary hover:text-on-primary px-5 py-3 rounded-lg font-sans font-medium text-sm transition-colors text-center w-full block md:hidden border border-primary/20 z-10"
      >
        View Details
      </Link>
    </div>
  );
}
