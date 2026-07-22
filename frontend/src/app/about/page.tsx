import Link from "next/link";
import React from "react";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-surface selection:bg-primary-container selection:text-on-primary-container overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-md py-2xl md:py-[100px]">
        {/* Hero Section */}
        <div className="text-center mb-2xl md:mb-[100px] flex flex-col items-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-sm mb-6 shadow-sm shadow-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2"></span>
            Open Source Initiative
          </div>
          <h1 className="font-sans text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-on-surface">
            About IT Jobs Nepal
          </h1>
          <p className="text-on-surface-variant font-sans text-lg md:text-xl max-w-2xl leading-relaxed">
            A community-driven platform built to{" "}
            <strong className="text-primary font-medium">unify</strong> the
            fragmented IT job market in Nepal. Simple, fast, and completely
            free.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {/* Card 1: Purpose */}
          <section className="group relative bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/30 rounded-3xl p-8 hover:bg-surface-container-low transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
              <span className="material-symbols-outlined text-6xl text-primary">
                target
              </span>
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                <span className="material-symbols-outlined text-primary">
                  flag
                </span>
              </div>
              <h2 className="font-sans text-2xl font-bold mb-4 text-on-surface">
                Project Purpose
              </h2>
              <div className="space-y-4 font-sans text-on-surface-variant leading-relaxed">
                <p>
                  Navigating the tech job market in Nepal often means jumping
                  between dozens of career pages, local portals, and LinkedIn.
                  <strong className="text-on-surface font-semibold">
                    {" "}
                    IT Jobs Nepal
                  </strong>{" "}
                  automatically aggregates opportunities into a single,
                  searchable platform.
                </p>
                <p>
                  Our goal is to make job hunting effortless for developers,
                  designers, and IT professionals with a clean, ad-free
                  interface.
                </p>
              </div>
            </div>
          </section>

          {/* Card 2: How It Works */}
          <section className="group relative bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/30 rounded-3xl p-8 hover:bg-surface-container-low transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
              <span className="material-symbols-outlined text-6xl text-primary">
                memory
              </span>
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                <span className="material-symbols-outlined text-primary">
                  code_blocks
                </span>
              </div>
              <h2 className="font-sans text-2xl font-bold mb-4 text-on-surface">
                How It Works
              </h2>
              <div className="font-sans text-on-surface-variant leading-relaxed mb-4">
                We use custom Python web scrapers that
                intelligently extract job data from:
              </div>
              <ul className="space-y-3 font-sans text-on-surface-variant">
                {[
                  "50+ individual company career pages",
                  "Top portals (MeroJob, JobsNepal, etc.)",
                  "LinkedIn targeted at Nepal region",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Card 3: Open Source (Full width) */}
          <section className="md:col-span-2 group relative bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/30 rounded-3xl p-8 md:p-12 overflow-hidden hover:bg-surface-container-low transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5">
            <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-5 blur-[2px] group-hover:opacity-10 group-hover:blur-none transition-all duration-700 pointer-events-none hidden md:block">
              <span className="material-symbols-outlined text-[150px] text-primary">
                terminal
              </span>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <span className="material-symbols-outlined text-[18px]">
                    volunteer_activism
                  </span>
                  100% Free & Open
                </div>
                <h2 className="font-sans text-3xl font-bold mb-4 text-on-surface">
                  Built by the Community
                </h2>
                <p className="font-sans  text-lg mb-6">
                  This platform is maintained under the MIT License. We believe
                  in transparency and collaboration. No user accounts, no
                  subscriptions, and no paywalls.
                </p>
                <a
                  href="https://github.com/sarozpradhan64/IT-jobs-in-nepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-primary text-on-primary px-8 py-4 rounded-full font-sans font-semibold hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Contribute on GitHub
                </a>
              </div>
            </div>
          </section>

          {/* Card 4: Disclaimer (Full width) */}
          <section className="md:col-span-2 bg-error-container/10 border border-error/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center hover:bg-error-container/20 transition-colors duration-300">
            <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">
                warning
              </span>
            </div>
            <div>
              <h2 className="font-sans text-xl font-bold text-error mb-2">
                Disclaimer
              </h2>
              <p className="font-sans text-on-surface-variant text-sm md:text-base leading-relaxed">
                IT Jobs Nepal is strictly an aggregator. We do not host job
                applications natively. Clicking "Apply" will redirect you to the
                original source. Always verify the authenticity of a job posting
                before sharing sensitive personal information.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
