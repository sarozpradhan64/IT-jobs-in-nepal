import Link from "next/link";
import { JobData } from "@/components/ui/job-card";
import { notFound } from "next/navigation";

// Example Fetcher for Job Details
async function getJobDetails(slug: string): Promise<JobData | null> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/jobs/${slug}`, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch job details");
    }
    
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function JobDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const job = await getJobDetails(params.slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="bg-surface-container-lowest min-h-screen py-xl">
      <div className="max-w-4xl mx-auto px-md">
        
        {/* Back Link */}
        <Link href="/jobs" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-mono text-sm mb-lg transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Job Board
        </Link>

        {/* Job Header Card */}
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-lg mb-xl relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-lg">
            <div className="flex items-start gap-md">
              <div className="w-16 h-16 bg-surface-variant rounded-xl flex items-center justify-center font-bold text-primary border border-outline-variant/30 overflow-hidden shrink-0">
                {job.company.logo_url ? (
                  <img src={job.company.logo_url} alt={job.company.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">{job.company.name.substring(0, 2).toUpperCase()}</span>
                )}
              </div>
              
              <div>
                <h1 className="font-sans text-3xl md:text-4xl font-bold mb-2">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <Link href={`/companies/${job.company.name.toLowerCase().replace(' ', '-')}`} className="font-sans text-lg font-medium text-primary hover:underline">
                    {job.company.name}
                  </Link>
                  <span className="text-outline-variant">•</span>
                  <div className="flex items-center gap-1 text-on-surface-variant font-mono text-sm">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {job.location} ({job.remote_status})
                  </div>
                  <span className="text-outline-variant">•</span>
                  <div className="flex items-center gap-1 text-on-surface-variant font-mono text-sm">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    {new Date(job.posted_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="shrink-0 w-full md:w-auto flex flex-col gap-3">
              <a 
                href={job.apply_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-primary text-on-primary px-8 py-3 rounded-xl font-sans font-bold hover:opacity-90 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
              >
                Apply Now
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
              <button className="border border-outline-variant/50 text-on-surface px-8 py-3 rounded-xl font-sans font-medium hover:bg-surface-variant transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">bookmark_border</span>
                Save Job
              </button>
            </div>
          </div>
          
          <div className="relative z-10 border-t border-outline-variant/20 mt-lg pt-lg flex flex-wrap gap-md">
            <div className="flex-1 min-w-[120px]">
              <p className="font-mono text-xs text-on-surface-variant uppercase tracking-wider mb-1">Employment Type</p>
              <p className="font-sans font-medium capitalize">{job.employment_type.replace('-', ' ')}</p>
            </div>
            <div className="flex-1 min-w-[120px]">
              <p className="font-mono text-xs text-on-surface-variant uppercase tracking-wider mb-1">Experience Level</p>
              <p className="font-sans font-medium capitalize">{job.experience_level}</p>
            </div>
            <div className="flex-1 min-w-[120px]">
              <p className="font-mono text-xs text-on-surface-variant uppercase tracking-wider mb-1">Salary Range</p>
              <p className="font-sans font-medium">{job.salary || "Not Disclosed"}</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout for Body */}
        <div className="flex flex-col lg:flex-row gap-xl">
          
          {/* Main Content */}
          <div className="lg:w-2/3 space-y-xl">
            
            {/* Tech Stack / Skills */}
            {job.skills && job.skills.length > 0 && (
              <section>
                <h2 className="font-sans text-2xl font-bold mb-4">Tech Stack & Skills</h2>
                <div className="flex flex-wrap gap-xs">
                  {job.skills.map((skill) => (
                    <span key={skill.id} className="px-4 py-2 bg-surface-container-high rounded-full font-mono text-sm border border-outline-variant/20">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Description */}
            <section>
              <h2 className="font-sans text-2xl font-bold mb-4">Job Description</h2>
              <div className="prose prose-invert prose-p:font-sans prose-p:text-on-surface-variant prose-p:leading-relaxed prose-li:font-sans prose-li:text-on-surface-variant max-w-none">
                {/* Fallback rendering if description is plain text. In reality you might use a markdown renderer here */}
                {job.description ? (
                  job.description.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4">{paragraph}</p>
                  ))
                ) : (
                  <p>No description provided by the company.</p>
                )}
              </div>
            </section>

          </div>

          {/* Right Sidebar */}
          <aside className="lg:w-1/3">
            <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-lg sticky top-24">
              <h3 className="font-sans text-xl font-bold mb-4">About the Company</h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-surface-variant rounded-lg flex items-center justify-center font-bold text-primary shrink-0">
                  {job.company.logo_url ? (
                    <img src={job.company.logo_url} alt={job.company.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    job.company.name.substring(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <h4 className="font-sans font-bold">{job.company.name}</h4>
                  <Link href={`/companies/${job.company.name.toLowerCase().replace(' ', '-')}`} className="font-mono text-xs text-primary hover:underline">
                    View Profile
                  </Link>
                </div>
              </div>
              
              <div className="space-y-4 font-sans text-sm text-on-surface-variant">
                <p>We are a fast-growing tech company operating in Nepal, focused on delivering high-quality software solutions globally.</p>
                <Link href="#" className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">link</span>
                  Company Website
                </Link>
              </div>
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  );
}
