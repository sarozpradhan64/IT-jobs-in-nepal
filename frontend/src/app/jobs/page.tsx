import React from "react";
import { JobCard, JobData } from "@/components/ui/job-card";
import { JobFilters } from "@/components/ui/job-filters";

async function getJobs(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const queryParams = new URLSearchParams();

  if (searchParams.q) queryParams.append("q", searchParams.q as string);
  if (searchParams.role)
    queryParams.append("skill", searchParams.role as string);
  if (searchParams.remote_status)
    queryParams.append("remote_status", searchParams.remote_status as string);

  const endpoint = `/api/jobs?${queryParams.toString()}`;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return [];
  }
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const jobs: JobData[] = await getJobs(resolvedParams);

  return (
    <div className="bg-surface-container-lowest min-h-screen py-lg">
      <div className="max-w-7xl mx-auto px-md">
        {/* Page Header */}
        <div className="mb-xl">
          <h1 className="font-sans text-4xl font-bold mb-2">Job Board</h1>
          <p className="text-on-surface-variant font-sans text-lg">
            Discover the latest roles from top tech companies across Nepal.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-lg">
          {/* Sidebar / Filters (Placeholder for full implementation) */}
          <aside className="w-full lg:w-1/4 shrink-0">
            <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-md sticky top-24">
              <h3 className="font-sans text-xl font-bold mb-4">Filters</h3>
              <React.Suspense
                fallback={
                  <div className="h-40 animate-pulse bg-surface-variant rounded-lg"></div>
                }
              >
                <JobFilters />
              </React.Suspense>
            </div>
          </aside>

          {/* Job Listings */}
          <div className="grow">
            <div className="flex justify-between items-center mb-md">
              <p className="font-mono text-sm text-on-surface-variant">
                Showing{" "}
                <span className="font-bold text-on-surface">{jobs.length}</span>{" "}
                active jobs
              </p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-on-surface-variant">
                  Sort by:
                </span>
                <select className="bg-surface-variant border-outline-variant/30 text-on-surface font-sans text-sm rounded-lg focus:ring-primary/20 outline-none p-2 cursor-pointer">
                  <option>Latest</option>
                  <option>Relevance</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {jobs.length > 0 ? (
                jobs.map((job) => <JobCard key={job.id} job={job} />)
              ) : (
                <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-xl text-center">
                  <span className="material-symbols-outlined text-outline text-5xl mb-4">
                    search_off
                  </span>
                  <h3 className="font-sans text-2xl font-bold mb-2">
                    No jobs found
                  </h3>
                  <p className="text-on-surface-variant font-sans">
                    We couldn't find any jobs matching your criteria. Try
                    adjusting your filters or search term.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination Placeholder */}
            {jobs.length > 0 && (
              <div className="mt-xl flex justify-center">
                <button className="border border-outline-variant/50 text-on-surface px-8 py-3 rounded-lg font-mono text-sm hover:bg-surface-variant hover:border-primary/50 transition-all">
                  Load More Jobs
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
