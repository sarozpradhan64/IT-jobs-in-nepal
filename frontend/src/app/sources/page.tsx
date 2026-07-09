import React from "react";

export interface SourceData {
  id: number;
  name: string;
  source_type: string; // 'portal', 'linkedin', 'company'
  base_url: string;
  last_scraped_at: string | null;
  status: string; // 'active', 'error', 'disabled'
  active_jobs_count: number;
}

// Fetch Sources
async function getSources(): Promise<SourceData[]> {
  try {
    // We haven't built the /api/sources endpoint on backend yet, but we will assume it exists
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "${process.env.NEXT_PUBLIC_API_URL}"}/api/sources`,
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
    console.error("Failed to fetch sources:", error);
    // Return mock data if backend isn't ready
    return [
      {
        id: 1,
        name: "MeroJob",
        source_type: "portal",
        base_url: "https://merojob.com",
        last_scraped_at: new Date().toISOString(),
        status: "active",
        active_jobs_count: 142,
      },
      {
        id: 2,
        name: "LinkedIn Jobs (Nepal)",
        source_type: "linkedin",
        base_url: "https://linkedin.com",
        last_scraped_at: new Date().toISOString(),
        status: "active",
        active_jobs_count: 85,
      },
      {
        id: 3,
        name: "Fusemachines Careers",
        source_type: "company",
        base_url: "https://fusemachines.com/careers",
        last_scraped_at: new Date(Date.now() - 3600000).toISOString(),
        status: "active",
        active_jobs_count: 4,
      },
    ];
  }
}

export default async function SourcesPage() {
  const sources = await getSources();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full font-mono text-xs uppercase">
            Active
          </span>
        );
      case "error":
        return (
          <span className="px-3 py-1 bg-error/10 text-error border border-error/20 rounded-full font-mono text-xs uppercase">
            Error
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full font-mono text-xs uppercase">
            {status}
          </span>
        );
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "portal":
        return "hub";
      case "linkedin":
        return "work";
      case "company":
        return "business";
      default:
        return "public";
    }
  };

  return (
    <div className="bg-surface-container-lowest min-h-screen py-lg">
      <div className="max-w-5xl mx-auto px-md">
        {/* Page Header */}
        <div className="mb-xl text-center md:text-left">
          <h1 className="font-sans text-4xl font-bold mb-2">
            Aggregation Sources
          </h1>
          <p className="text-on-surface-variant font-sans text-lg max-w-2xl">
            Real-time status of all career pages, portals, and platforms
            currently being scraped by DevJobs Nepal.
          </p>
        </div>

        {/* Sources Table */}
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans">
              <thead className="bg-surface-variant/50 border-b border-outline-variant/20 text-on-surface-variant font-mono text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Source Name</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-right">
                    Active Jobs
                  </th>
                  <th className="px-6 py-4 font-medium text-right">
                    Last Scraped
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {sources.map((source) => (
                  <tr
                    key={source.id}
                    className="hover:bg-surface-container-high/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary/70">
                          {getSourceIcon(source.source_type)}
                        </span>
                        <div>
                          <p className="font-bold text-on-surface">
                            {source.name}
                          </p>
                          <a
                            href={source.base_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-outline hover:text-primary transition-colors"
                          >
                            {source.base_url.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-on-surface-variant text-sm">
                        {source.source_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(source.status)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium">
                      {source.active_jobs_count}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm text-on-surface-variant">
                        {source.last_scraped_at ? (
                          <>
                            <div>
                              {new Date(
                                source.last_scraped_at,
                              ).toLocaleDateString()}
                            </div>
                            <div className="font-mono text-xs mt-1">
                              {new Date(
                                source.last_scraped_at,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </>
                        ) : (
                          "Never"
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
