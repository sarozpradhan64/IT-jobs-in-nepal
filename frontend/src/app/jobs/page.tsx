import React from "react";
import Link from "next/link";
import { JobCard, JobData } from "@/components/ui/job-card";
import { JobFilters } from "@/components/ui/job-filters";
import { JobSort } from "@/components/ui/job-sort";
import { Pagination } from "@/components/ui/pagination";
import { SlidersHorizontal, SearchX } from "lucide-react";

async function getJobs(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const queryParams = new URLSearchParams();

  if (searchParams.q) queryParams.append("q", searchParams.q as string);
  if (searchParams.category)
    queryParams.append("category", searchParams.category as string);
  if (searchParams.remote_status)
    queryParams.append("remote_status", searchParams.remote_status as string);
  if (searchParams.sort_by)
    queryParams.append("sort_by", searchParams.sort_by as string);
  const page = searchParams.page ? parseInt(searchParams.page as string, 10) : 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  queryParams.append("skip", skip.toString());
  queryParams.append("limit", limit.toString());

  const endpoint = `/api/jobs?${queryParams.toString()}`;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) {
      return { jobs: [], total: 0 };
    }

    const data = await res.json();
    const total = parseInt(res.headers.get("X-Total-Count") || "0", 10);
    return { jobs: Array.isArray(data) ? data : [], total };
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return { jobs: [], total: 0 };
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
      next: { revalidate: 3600 }, // Cache categories for 1 hour
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const { jobs, total } = await getJobs(resolvedParams);
  const categories = await getCategories();
  
  const currentPage = resolvedParams.page ? parseInt(resolvedParams.page as string, 10) : 1;
  const limit = 10;
  

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasNextPage = currentPage < totalPages;

  const getPaginationUrl = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(resolvedParams)) {
      if (value !== undefined) {
        params.append(key, value as string);
      }
    }
    params.set("page", page.toString());
    return `/jobs?${params.toString()}`;
  };

  return (
    <div className="bg-surface min-h-screen pb-xl relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute -top-16 -right-16 w-72 h-72 bg-primary/15 rounded-full blur-[96px] pointer-events-none" style={{zIndex: 0}} />
      <div className="absolute top-24 -left-16 w-56 h-56 bg-secondary/15 rounded-full blur-[96px] pointer-events-none" style={{zIndex: 0}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Page Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-sans text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Discover Your Next{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tech Role
            </span>
          </h1>
          <p className="text-on-surface-variant font-sans text-lg max-w-2xl">
            Explore the latest opportunities from top companies across Nepal. Find the perfect fit for your career.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar / Filters */}
          <aside className="w-full lg:w-1/4 shrink-0 lg:sticky lg:top-24 z-10">
            <div className="bg-surface-container-low/80 backdrop-blur-md border border-outline-variant/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-sans text-xl font-bold flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-primary" />
                  Filters
                </h3>
              </div>
              <React.Suspense
                fallback={
                  <div className="space-y-4">
                    <div className="h-10 animate-pulse bg-surface-variant rounded-lg"></div>
                    <div className="h-32 animate-pulse bg-surface-variant rounded-lg"></div>
                    <div className="h-24 animate-pulse bg-surface-variant rounded-lg"></div>
                  </div>
                }
              >
                <JobFilters categories={categories} />
              </React.Suspense>
            </div>
          </aside>

          {/* Job Listings */}
          <div className="grow w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 bg-surface-container-low/50 backdrop-blur-sm border border-outline-variant/20 rounded-xl p-4">
              <p className="font-sans text-sm text-on-surface-variant">
                Showing{" "}
                <span className="font-bold text-on-surface px-1">{jobs.length}</span>{" "}
                active jobs
              </p>
              <div className="flex items-center gap-3">
                <span className="font-sans text-sm font-medium text-on-surface-variant">
                  Sort by:
                </span>
                <React.Suspense fallback={<div className="h-9 w-32 bg-surface-variant rounded-lg animate-pulse" />}>
                  <JobSort />
                </React.Suspense>
              </div>
            </div>

            <div className="space-y-4">
              {jobs.length > 0 ? (
                jobs.map((job) => <JobCard key={job.id} job={job} />)
              ) : (
                <div className="relative bg-surface-container-low border border-outline-variant/20 rounded-2xl p-16 text-center flex flex-col items-center overflow-hidden">
                  {/* Subtle dot grid background */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: "radial-gradient(circle, var(--color-outline-variant) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                  {/* Radial fade overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "radial-gradient(ellipse at center, transparent 30%, var(--color-surface-container-low) 80%)",
                    }}
                  />

                  {/* Icon */}
                  <div className="relative z-10 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-surface border border-outline-variant/30 flex items-center justify-center shadow-lg shadow-black/20">
                      <SearchX size={32} className="text-outline" />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="relative z-10">
                    <h3 className="font-sans text-xl font-bold text-on-surface mb-2">
                      No jobs found
                    </h3>
                    <p className="text-on-surface-variant font-sans text-sm leading-relaxed">
                      No roles match your current filters. Try broadening your search or clearing a filter.
                    </p>
                  </div>

                  {/* Clear filters CTA */}
                  <a
                    href="/jobs"
                    className="relative z-10 mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary font-sans font-medium text-sm hover:bg-primary/20 transition-colors"
                  >
                    Clear all filters
                  </a>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              getPaginationUrl={getPaginationUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
