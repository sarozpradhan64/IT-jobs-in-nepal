import Link from "next/link";
import React from "react";

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
  // Format the posted date relatively (e.g. 3h ago, 2d ago)
  const getRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="group bg-surface-container-low border border-outline-variant/20 rounded-xl p-md flex flex-col gap-4 hover:bg-surface-container-high hover:border-primary/50 transition-all cursor-pointer relative">
      <div className="flex flex-col md:flex-row justify-between gap-md w-full">
        <div className="flex items-start md:items-center gap-md grow">
          {/* Company Logo or Fallback */}
          <div className="w-12 h-12 bg-surface-variant rounded-lg flex items-center justify-center font-bold text-primary border border-outline-variant/30 overflow-hidden shrink-0">
            {job.company.logo_url ? (
              <img src={job.company.logo_url} alt={job.company.name} className="w-full h-full object-cover" />
            ) : (
              <span>{job.company.name.substring(0, 2).toUpperCase()}</span>
            )}
          </div>
          
          <div className="grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 w-full">
              <h4 className="font-sans text-xl font-bold group-hover:text-primary transition-colors">{job.title}</h4>
              
              <Link href={`/jobs/${job.slug}`} className="bg-secondary-container text-on-secondary-container px-6 py-2 rounded-lg font-mono text-sm hover:opacity-80 transition-opacity whitespace-nowrap text-center hidden md:block">
                View Details
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center gap-xs mt-1">
              <span className="font-mono text-sm font-medium text-on-surface">{job.company.name}</span>
              <span className="text-outline-variant text-xs">•</span>
              <span className="font-mono text-xs text-on-surface-variant">{job.location} ({job.remote_status})</span>
              <span className="text-outline-variant text-xs hidden sm:inline">•</span>
              <span className="font-mono text-xs text-on-surface-variant hidden sm:inline capitalize">{job.employment_type.replace('-', ' ')}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Badges at bottom */}
      <div className="flex flex-wrap items-center gap-xs mt-2 md:mt-0 md:pt-2 border-t border-outline-variant/10 md:border-transparent pt-4">
        {job.skills.slice(0, 3).map((skill) => (
          <span key={skill.id} className="px-3 py-1 bg-surface-variant rounded-full text-xs font-mono text-on-surface-variant">
            {skill.name}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="px-3 py-1 bg-surface-variant rounded-full text-xs font-mono text-on-surface-variant">
            +{job.skills.length - 3}
          </span>
        )}
        <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-mono">
          {getRelativeTime(job.posted_date)}
        </span>
        {job.source_name && (
          <span className="px-3 py-1 bg-surface-variant text-on-surface-variant border border-outline-variant/30 rounded-full text-xs font-mono capitalize whitespace-nowrap">
            via {job.source_name.includes('CareerPage:') ? 'Career Page' : job.source_name}
          </span>
        )}
      </div>

      <Link href={`/jobs/${job.slug}`} className="bg-secondary-container text-on-secondary-container px-6 py-2 rounded-lg font-mono text-sm hover:opacity-80 transition-opacity whitespace-nowrap text-center w-full block md:hidden mt-2">
        View Details
      </Link>
    </div>
  );
}
