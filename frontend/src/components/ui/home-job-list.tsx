"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { JobCard, JobData } from "@/components/ui/job-card";
import { Search, Sparkles, ArrowRight, Filter, Briefcase } from "lucide-react";

interface HomeJobListProps {
  jobs: JobData[];
}

const CATEGORY_TABS = [
  { id: "all", label: "All Roles" },
  { id: "frontend", label: "Frontend", match: ["frontend", "react", "vue", "angular", "ui", "web"] },
  { id: "backend", label: "Backend", match: ["backend", "python", "django", "node", "java", "golang", "php", "laravel", ".net"] },
  { id: "devops", label: "DevOps & Cloud", match: ["devops", "cloud", "aws", "docker", "kubernetes", "infra"] },
  { id: "data", label: "Data & AI", match: ["data", "ai", "machine learning", "ml", "analyst"] },
  { id: "remote", label: "Remote Only", isRemote: true },
];

export function HomeJobList({ jobs }: HomeJobListProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [filterQuery, setFilterQuery] = useState("");

  const filteredJobs = useMemo(() => {
    let result = jobs;

    // Filter by tab
    if (activeTab === "remote") {
      result = result.filter(
        (j) => j.remote_status?.toLowerCase() === "remote"
      );
    } else if (activeTab !== "all") {
      const tabConfig = CATEGORY_TABS.find((t) => t.id === activeTab);
      if (tabConfig?.match) {
        result = result.filter((j) => {
          const text = `${j.title} ${j.description || ""} ${(j.skills || []).map((s) => s.name).join(" ")}`.toLowerCase();
          return tabConfig.match.some((m) => text.includes(m));
        });
      }
    }

    // Filter by search input
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase().trim();
      result = result.filter((j) => {
        const text = `${j.title} ${j.company?.name || ""} ${j.location || ""} ${(j.skills || []).map((s) => s.name).join(" ")}`.toLowerCase();
        return text.includes(q);
      });
    }

    return result;
  }, [jobs, activeTab, filterQuery]);

  return (
    <div className="w-full">
      {/* Quick Filter Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-[#0f172a]/80 backdrop-blur-md border border-white/10 p-3 sm:p-4 rounded-2xl shadow-premium">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-[#1e293b]/60 text-slate-400 hover:text-white hover:bg-[#1e293b]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Quick Filter Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Quick filter 100 jobs..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#1e293b]/70 border border-white/5 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition-all"
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Counter bar */}
      <div className="flex items-center justify-between mb-6 px-1">
        <p className="text-xs sm:text-sm font-mono text-slate-400">
          Showing <span className="font-bold text-white">{filteredJobs.length}</span> of{" "}
          <span className="font-bold text-secondary">{jobs.length}</span> latest tech positions
        </p>

        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-white transition-colors"
        >
          <span>Open Full Job Board</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Grid of Jobs */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0f172a]/50 border border-white/10 rounded-2xl">
          <Briefcase size={36} className="text-secondary/60 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white mb-1">No matching jobs found</h4>
          <p className="text-sm text-slate-400 mb-4">
            Try adjusting your keyword filter or clearing active category tabs.
          </p>
          <button
            onClick={() => {
              setActiveTab("all");
              setFilterQuery("");
            }}
            className="px-4 py-2 rounded-xl bg-secondary/15 border border-secondary/30 text-secondary text-xs font-semibold hover:bg-secondary hover:text-[#020617] transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
