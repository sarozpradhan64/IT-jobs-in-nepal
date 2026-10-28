import Link from "next/link";
import { CompanySearch } from "@/components/ui/company-search";
import { ArrowRight, Building2 } from "lucide-react";
import { SectionTitle } from "@/components/ui/section-title";

export interface CompanyData {
  id: number;
  name: string;
  slug: string;
  website?: string;
  career_page?: string;
  logo_url?: string;
  overview?: string;
  active_job_count?: number;
}

// Fetch Companies
async function getCompanies(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const query = searchParams.q ? `?search=${searchParams.q}` : "";

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/companies${query}`,
      {
        next: { revalidate: 60 },
      },
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    return [];
  }
}

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const companies: CompanyData[] = await getCompanies(resolvedParams);

  return (
    <div className="bg-[#020617] min-h-screen py-10 pb-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Page Header */}
        <div className="mb-10">
          <SectionTitle
            title="Tech Companies in Nepal"
            subtitle="TECH ECOSYSTEM DIRECTORY"
          />
          <p className="text-slate-300 font-sans text-base max-w-2xl -mt-4">
            Explore the ecosystem of product startups, engineering hubs, and international tech companies hiring top developers in Nepal.
          </p>
        </div>

        {/* Search Bar */}
        <CompanySearch />

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.length > 0 ? (
            companies.map((company) => (
              <Link
                href={`/companies/${company.slug}`}
                key={company.id}
                className="group relative bg-[#0f172a] border border-white/10 rounded-2xl p-6 flex flex-col hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 shadow-premium overflow-hidden"
              >
                {/* Left accent bar on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-full scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-300" />

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-[#1e293b] rounded-xl flex items-center justify-center font-bold text-slate-200 border border-white/10 overflow-hidden shrink-0 shadow-inner transition-colors group-hover:border-white/20">
                    {company.logo_url ? (
                      <img
                        src={company.logo_url}
                        alt={company.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-lg">
                        {company.name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-sans text-lg font-bold text-white group-hover:text-[#a78bfa] transition-colors line-clamp-1">
                      {company.name}
                    </h3>
                    <div className="font-mono text-xs text-slate-400 group-hover:text-white transition-colors flex items-center gap-1 mt-1 font-medium">
                      <span>View Profile</span>
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>

                <p className="font-sans text-xs text-slate-400 line-clamp-3 mb-6 grow leading-relaxed">
                  {company.overview ||
                    "Tech innovator in Nepal with active hiring pipelines. View active software engineering roles and team overview."}
                </p>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                  <span className="font-mono text-xs text-slate-400">
                    {company.active_job_count !== undefined 
                      ? `${company.active_job_count} Active Position${company.active_job_count !== 1 ? 's' : ''}` 
                      : 'Active Positions'}
                  </span>
                  <span className="bg-white/5 border border-white/10 text-slate-300 px-3 py-1 rounded-full font-mono text-xs font-medium uppercase tracking-wider transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary group-hover:text-white">
                    View Roles
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full bg-[#0f172a] border border-white/10 rounded-2xl p-16 text-center shadow-premium">
              <Building2 size={48} className="text-secondary/60 mx-auto mb-4 block" />
              <h3 className="font-sans text-xl font-bold text-white mb-2">
                No companies found
              </h3>
              <p className="text-slate-400 font-sans text-sm">
                We couldn&apos;t find any companies matching your search keywords.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
