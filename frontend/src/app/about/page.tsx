import Link from "next/link";
import React from "react";

export default function AboutPage() {
  return (
    <div className="bg-surface-container-lowest min-h-screen py-xl">
      <div className="max-w-4xl mx-auto px-md">
        
        {/* Page Header */}
        <div className="mb-xl text-center md:text-left">
          <h1 className="font-sans text-4xl md:text-5xl font-bold mb-4">About DevJobs Nepal</h1>
          <p className="text-on-surface-variant font-sans text-lg max-w-2xl">
            A community-driven, open-source initiative to unify the fragmented IT job market in Nepal.
          </p>
        </div>

        {/* Content Blocks */}
        <div className="space-y-xl">
          
          <section className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-lg md:p-xl">
            <h2 className="font-sans text-2xl font-bold mb-4">Project Purpose</h2>
            <div className="prose prose-invert prose-p:font-sans prose-p:text-on-surface-variant max-w-none">
              <p>
                Navigating the tech job market in Nepal often means jumping between dozens of company career pages, various local job portals, and LinkedIn. 
                <strong> DevJobs Nepal</strong> was built to solve this problem by automatically aggregating opportunities from multiple trusted sources into a single, blazing-fast, searchable platform.
              </p>
              <p>
                Our goal is to make job hunting easier for Nepalese developers, designers, data scientists, and IT professionals by providing a clean, ad-free, and highly performant interface.
              </p>
            </div>
          </section>

          <section className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-lg md:p-xl">
            <h2 className="font-sans text-2xl font-bold mb-4">How It Works</h2>
            <div className="prose prose-invert prose-p:font-sans prose-p:text-on-surface-variant max-w-none">
              <p>
                We use custom-built web scrapers powered by Python (FastAPI, Playwright, and BeautifulSoup) that run on a schedule. These scrapers intelligently extract job data from:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-on-surface-variant font-sans">
                <li>Over 50+ individual company career pages (sourced from our community Airtable list).</li>
                <li>Top Nepalese job portals like MeroJob, JobsNepal, and Kumari Job.</li>
                <li>LinkedIn job postings targeted at the Nepal region.</li>
              </ul>
              <p className="mt-4">
                The data is then normalized, deduplicated, and served to this Next.js frontend via a fast REST API.
              </p>
            </div>
          </section>

          <section className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-lg md:p-xl border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="font-sans text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">volunteer_activism</span>
              Open-Source Philosophy
            </h2>
            <div className="prose prose-invert prose-p:font-sans prose-p:text-on-surface-variant max-w-none">
              <p>
                This platform is 100% open-source and community-maintained under the MIT License. We believe in transparency and collaboration.
                There are no user accounts, no subscriptions, and no paywalls.
              </p>
              <div className="mt-6">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-mono text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  View Source on GitHub
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
            </div>
          </section>

          <section className="bg-error-container/20 border border-error/30 rounded-2xl p-lg md:p-xl">
            <h2 className="font-sans text-xl font-bold text-error mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span>
              Disclaimer
            </h2>
            <p className="font-sans text-on-surface-variant text-sm leading-relaxed">
              DevJobs Nepal is strictly an aggregator. We do not host job applications natively. Clicking "Apply" on any job posting will always redirect you to the original source (the company's actual career page or the respective job portal). Always verify the authenticity of a job posting before sharing sensitive personal information.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
