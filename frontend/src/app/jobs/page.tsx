import React from "react";
import Link from "next/link";
import { JobCard, JobData } from "@/components/ui/job-card";
import { JobFilters } from "@/components/ui/job-filters";
import { JobSort } from "@/components/ui/job-sort";
import { SourceFilter } from "@/components/ui/source-filter";
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
  if (searchParams.employment_type)
    queryParams.append("employment_type", searchParams.employment_type as string);
  if (searchParams.experience_level)
    queryParams.append("experience_level", searchParams.experience_level as string);
  if (searchParams.source)
    queryParams.append("source", searchParams.source as string);
  if (searchParams.sort_by)
    queryParams.append("sort_by", searchParams.sort_by as string);
  const page = searchParams.page ? parseInt(searchParams.page as string, 10) : 1;
  const limit = 20;
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

  const activeFilterCount = ["q", "category", "remote_status", "employment_type", "experience_level", "source"]
    .filter((k) => resolvedParams[k]).length;

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
    <div className="bg-surface-container-lowest min-h-screen pb-xl">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        {/* Page Header */}
        <div className="mb-10">
          <p className="font-mono text-xs text-secondary uppercase tracking-widest mb-2">Jobs</p>
          <h1 className="font-sans text-4xl md:text-5xl font-bold mb-3 tracking-tight text-on-surface">
            Discover Your Next <span className="text-primary">Tech Role</span>
          </h1>
          <p className="text-on-surface-variant font-sans text-base max-w-2xl">
            Explore the latest opportunities from top companies across Nepal.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-20 z-10">
            <div className="bg-surface-container border border-outline-variant rounded-xl p-5">
              <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2 mb-5">
                <SlidersHorizontal size={13} className="text-primary" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                    <Link href="/jobs" className="font-mono text-[10px] text-outline hover:text-primary transition-colors">
                      Clear
                    </Link>
                  </span>
                )}
              </h3>
              <React.Suspense
                fallback={
                  <div className="space-y-3">
                    <div className="h-9 animate-pulse bg-surface-container-high rounded-lg" />
                    <div className="h-28 animate-pulse bg-surface-container-high rounded-lg" />
                    <div className="h-20 animate-pulse bg-surface-container-high rounded-lg" />
                  </div>
                }
              >
                <JobFilters categories={categories} />
              </React.Suspense>
            </div>
          </aside>

          {/* Listings */}
          <div className="grow w-full min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5 bg-surface-container border border-outline-variant rounded-xl px-4 py-3">
              <p className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
                <span className="font-bold text-on-surface text-sm">{total}</span> active listings
              </p>
              <div className="flex items-center gap-3">
                <React.Suspense fallback={<div className="h-8 w-28 bg-surface-container-high rounded-lg animate-pulse" />}>
                  <SourceFilter />
                </React.Suspense>
                <span className="font-mono text-xs text-on-surface-variant">Sort by:</span>
                <React.Suspense fallback={<div className="h-8 w-28 bg-surface-container-high rounded-lg animate-pulse" />}>
                  <JobSort />
                </React.Suspense>
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {jobs.length > 0 ? (
                jobs.map((job) => <JobCard key={job.id} job={job} />)
              ) : (
                <div className="md:col-span-2 xl:col-span-3 bg-surface-container border border-outline-variant rounded-xl p-16 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center mb-5">
                    <SearchX size={24} className="text-outline" />
                  </div>
                  <h3 className="font-sans text-base font-bold text-on-surface mb-1">No jobs found</h3>
                  <p className="text-on-surface-variant font-sans text-sm mb-6">
                    No roles match your current filters. Try broadening your search.
                  </p>
                  <a
                    href="/jobs"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary font-sans font-medium text-sm hover:bg-primary/20 transition-colors"
                  >
                    Clear all filters
                  </a>
                </div>
              )}
            </div>

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
