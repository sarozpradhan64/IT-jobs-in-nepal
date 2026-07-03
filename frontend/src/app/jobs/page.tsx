import { JobCard, JobData } from "@/components/ui/job-card";

async function getJobs(searchParams: { [key: string]: string | string[] | undefined }) {
  const query = searchParams.q ? `?q=${searchParams.q}` : "";
  const endpoint = searchParams.q ? `/api/jobs/search${query}` : "/api/jobs";
  
  try {
    const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
      next: { revalidate: 60 } // Cache for 60 seconds
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
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const jobs: JobData[] = await getJobs(searchParams);

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
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-mono text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-2">Search</h4>
                  <div className="flex items-center px-3 gap-2 bg-surface-variant rounded-lg border border-outline-variant/30">
                    <span className="material-symbols-outlined text-outline text-sm">search</span>
                    <input 
                      type="text" 
                      placeholder="e.g. React, Python"
                      className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-sans py-2 outline-none text-sm placeholder:text-outline/70"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-mono text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-2">Role Type</h4>
                  <div className="space-y-2">
                    {['Frontend', 'Backend', 'Fullstack', 'DevOps', 'Data', 'Design'].map((role) => (
                      <label key={role} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="rounded border-outline-variant/30 bg-surface text-primary focus:ring-primary/20 cursor-pointer" />
                        <span className="font-sans text-sm group-hover:text-primary transition-colors">{role}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-mono text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-2">Work Setup</h4>
                  <div className="space-y-2">
                    {['Onsite', 'Hybrid', 'Remote'].map((setup) => (
                      <label key={setup} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="rounded border-outline-variant/30 bg-surface text-primary focus:ring-primary/20 cursor-pointer" />
                        <span className="font-sans text-sm group-hover:text-primary transition-colors">{setup}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Job Listings */}
          <div className="grow">
            <div className="flex justify-between items-center mb-md">
              <p className="font-mono text-sm text-on-surface-variant">
                Showing <span className="font-bold text-on-surface">{jobs.length}</span> active jobs
              </p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-on-surface-variant">Sort by:</span>
                <select className="bg-surface-variant border-outline-variant/30 text-on-surface font-sans text-sm rounded-lg focus:ring-primary/20 outline-none p-2 cursor-pointer">
                  <option>Latest</option>
                  <option>Relevance</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))
              ) : (
                <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-xl text-center">
                  <span className="material-symbols-outlined text-outline text-5xl mb-4">search_off</span>
                  <h3 className="font-sans text-2xl font-bold mb-2">No jobs found</h3>
                  <p className="text-on-surface-variant font-sans">
                    We couldn't find any jobs matching your criteria. Try adjusting your filters or search term.
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
