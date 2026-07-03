import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-xl pb-lg md:pt-32 md:pb-xl hero-gradient">
        <div className="max-w-7xl mx-auto px-md text-center relative z-10">
          <h1 className="font-sans text-5xl md:text-6xl font-bold mb-sm max-w-4xl mx-auto tracking-tight animate-fade-in">
            Every IT Job in Nepal, <span className="text-primary">In One Place.</span>
          </h1>
          <p className="font-sans text-lg text-on-surface-variant max-w-2xl mx-auto mb-lg">
            Aggregating career pages, LinkedIn, and top portals for the Nepalese tech ecosystem. Open-source and developer-first.
          </p>
          
          {/* Modern Search Bar */}
          <div className="max-w-3xl mx-auto mb-lg">
            <div className="glass-panel p-2 rounded-2xl flex flex-col md:flex-row items-stretch gap-2 shadow-2xl">
              <div className="flex-grow flex items-center px-4 gap-3 bg-surface-container-low rounded-xl">
                <span className="material-symbols-outlined text-outline">search</span>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-sans py-4 outline-none placeholder:text-outline" 
                  placeholder="Search roles, tech, or companies..." 
                  type="text"
                />
              </div>
              <Link href="/jobs" className="bg-primary text-on-primary px-8 py-4 rounded-xl font-sans font-bold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
                Find My Next Role
              </Link>
            </div>
          </div>
          
          {/* Source Stats */}
          <div className="flex flex-wrap justify-center gap-md mt-lg">
            <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
              <span className="font-mono text-xs font-medium uppercase tracking-wider">50+ Career Pages Scraped</span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
              <span className="font-mono text-xs font-medium uppercase tracking-wider">300+ LinkedIn Jobs</span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
              <span className="font-mono text-xs font-medium uppercase tracking-wider">10+ Portals Integrated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Role Grid */}
      <section className="py-xl bg-surface border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-md">
          <div className="flex flex-col md:flex-row justify-between items-end mb-lg">
            <div>
              <h2 className="font-sans text-3xl font-bold mb-2">Browse by Role</h2>
              <p className="text-on-surface-variant font-sans text-base">Optimized listings for specific engineering tracks.</p>
            </div>
            <Link className="text-primary font-mono text-sm font-medium flex items-center gap-1 group mt-4 md:mt-0" href="/jobs">
              View All <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            {/* Frontend */}
            <Link href="/jobs?q=frontend" className="group relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-low p-md hover:border-primary/50 transition-all cursor-pointer">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-9xl">code</span>
              </div>
              <span className="material-symbols-outlined text-primary mb-md block text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>code</span>
              <h3 className="font-sans text-2xl font-bold mb-1">Frontend</h3>
              <p className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">Active Positions</p>
            </Link>

            {/* Backend */}
            <Link href="/jobs?q=backend" className="group relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-low p-md hover:border-primary/50 transition-all cursor-pointer">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-9xl">database</span>
              </div>
              <span className="material-symbols-outlined text-primary mb-md block text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>database</span>
              <h3 className="font-sans text-2xl font-bold mb-1">Backend</h3>
              <p className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">Active Positions</p>
            </Link>

            {/* DevOps */}
            <Link href="/jobs?q=devops" className="group relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-low p-md hover:border-primary/50 transition-all cursor-pointer">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-9xl">cloud_done</span>
              </div>
              <span className="material-symbols-outlined text-primary mb-md block text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_done</span>
              <h3 className="font-sans text-2xl font-bold mb-1">DevOps</h3>
              <p className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">Active Positions</p>
            </Link>

            {/* Data Science */}
            <Link href="/jobs?q=data" className="group relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-low p-md hover:border-primary/50 transition-all cursor-pointer">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-9xl">analytics</span>
              </div>
              <span className="material-symbols-outlined text-primary mb-md block text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
              <h3 className="font-sans text-2xl font-bold mb-1">Data Science</h3>
              <p className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">Active Positions</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack Transparent Banner */}
      <section className="py-xl bg-surface border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-xl">
            <div className="max-w-lg">
              <h2 className="font-sans text-3xl font-bold mb-4">Built for Transparency</h2>
              <p className="font-sans text-base text-on-surface-variant mb-lg">
                DevJobs Nepal is more than just a job board. It's an open-source project designed to solve the fragmented job market. We use modern, robust technologies to ensure you never miss an opening.
              </p>
              <a className="inline-flex items-center gap-2 text-primary font-mono text-sm font-medium hover:underline" href="https://github.com">
                <span className="material-symbols-outlined">star</span>
                Contribute on GitHub
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
              <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant/20 flex flex-col items-center text-center">
                <div className="w-12 h-12 mb-xs flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
                </div>
                <span className="font-mono text-sm font-medium text-on-surface">FastAPI</span>
              </div>
              <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant/20 flex flex-col items-center text-center">
                <div className="w-12 h-12 mb-xs flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">layers</span>
                </div>
                <span className="font-mono text-sm font-medium text-on-surface">Next.js</span>
              </div>
              <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant/20 flex flex-col items-center text-center">
                <div className="w-12 h-12 mb-xs flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">browser_updated</span>
                </div>
                <span className="font-mono text-sm font-medium text-on-surface">Playwright</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
