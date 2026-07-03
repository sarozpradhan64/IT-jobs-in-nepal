import Link from "next/link";
import { notFound } from "next/navigation";
import { JobData, JobCard } from "@/components/ui/job-card";
import { CompanyData } from "../page";

// Fetch Company Details
async function getCompanyDetails(slug: string): Promise<CompanyData | null> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/companies/${slug}`, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch company details");
    }
    
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Fetch Active Jobs for Company
async function getCompanyJobs(companyId: number): Promise<JobData[]> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/jobs?company_id=${companyId}`, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch company jobs", error);
    return [];
  }
}

export default async function CompanyDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const company = await getCompanyDetails(params.slug);

  if (!company) {
    notFound();
  }

  const jobs = await getCompanyJobs(company.id);

  return (
    <div className="bg-surface-container-lowest min-h-screen pb-xl">
      
      {/* Company Header Banner */}
      <div className="bg-surface-container-low border-b border-outline-variant/20 pt-xl pb-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        
        <div className="max-w-5xl mx-auto px-md relative z-10">
          <Link href="/companies" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-mono text-sm mb-lg transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Directory
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg mt-md">
            <div className="flex items-center gap-lg">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-surface-variant rounded-2xl flex items-center justify-center font-bold text-primary border border-outline-variant/30 overflow-hidden shrink-0 shadow-lg bg-surface">
                {company.logo_url ? (
                  <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <span className="text-4xl">{company.name.substring(0, 2).toUpperCase()}</span>
                )}
              </div>
              
              <div>
                <h1 className="font-sans text-4xl md:text-5xl font-bold mb-3">{company.name}</h1>
                <div className="flex flex-wrap items-center gap-4">
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-on-surface-variant hover:text-primary font-mono text-sm transition-colors">
                      <span className="material-symbols-outlined text-sm">language</span>
                      Website
                    </a>
                  )}
                  {company.career_page && (
                    <a href={company.career_page} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-on-surface-variant hover:text-primary font-mono text-sm transition-colors">
                      <span className="material-symbols-outlined text-sm">work</span>
                      Careers Page
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-md mt-xl flex flex-col md:flex-row gap-xl">
        
        {/* Left Column: Overview */}
        <div className="w-full md:w-1/3">
          <div className="sticky top-24">
            <h3 className="font-sans text-2xl font-bold mb-4">About {company.name}</h3>
            <div className="prose prose-invert prose-p:font-sans prose-p:text-on-surface-variant prose-p:leading-relaxed text-sm">
              {company.overview ? (
                company.overview.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))
              ) : (
                <p>No detailed overview is currently available for this company.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Active Jobs */}
        <div className="w-full md:w-2/3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-sans text-2xl font-bold">Active Roles ({jobs.length})</h2>
          </div>
          
          <div className="space-y-4">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-lg text-center">
                <span className="material-symbols-outlined text-outline text-4xl mb-3">inbox</span>
                <p className="text-on-surface-variant font-sans">No active jobs found for {company.name} at the moment.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
