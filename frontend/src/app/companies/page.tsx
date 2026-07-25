import Link from "next/link";
import { CompanySearch } from "@/components/ui/company-search";
import { ArrowRight, Building2 } from "lucide-react";

export interface CompanyData {
  id: number;
  name: string;
  slug: string;
  website?: string;
  career_page?: string;
  logo_url?: string;
  overview?: string;
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
    <div className="bg-surface-container-lowest min-h-screen py-lg">
      <div className="max-w-7xl mx-auto px-md">
        {/* Page Header */}
        <div className="mb-xl text-center md:text-left">
          <h1 className="font-sans text-4xl font-bold mb-2">
            Tech Companies in Nepal
          </h1>
          <p className="text-on-surface-variant font-sans text-lg max-w-2xl">
            Explore the ecosystem of IT companies, startups, and international
            tech hubs hiring in Nepal.
          </p>
        </div>

        {/* Search Bar */}
        <CompanySearch />

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {companies.length > 0 ? (
            companies.map((company) => (
              <Link
                href={`/companies/${company.slug}`}
                key={company.id}
                className="group bg-surface-container-low border border-outline-variant/20 rounded-xl p-md flex flex-col hover:bg-surface-container-high hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex items-center gap-md mb-4">
                  <div className="w-16 h-16 bg-surface-variant rounded-lg flex items-center justify-center font-bold text-primary border border-outline-variant/30 overflow-hidden shrink-0">
                    {company.logo_url ? (
                      <img
                        src={company.logo_url}
                        alt={company.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl">
                        {company.name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-sans text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                      {company.name}
                    </h3>
                    <div className="font-mono text-xs text-primary flex items-center gap-1 mt-1">
                      View Profile{" "}
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>

                <p className="font-sans text-sm text-on-surface-variant line-clamp-3 mb-4 grow">
                  {company.overview ||
                    "No overview provided for this company yet. Click to view available job openings."}
                </p>

                <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between mt-auto">
                  <span className="font-mono text-xs text-on-surface-variant">
                    Active Jobs
                  </span>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-mono text-xs font-bold">
                    View Roles
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full bg-surface-container-low border border-outline-variant/20 rounded-xl p-xl text-center">
              <Building2 size={48} className="text-outline mx-auto mb-4 block" />
              <h3 className="font-sans text-2xl font-bold mb-2">
                No companies found
              </h3>
              <p className="text-on-surface-variant font-sans">
                We couldn't find any companies matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
