import Link from "next/link";
import React from "react";
import {
  Target,
  Flag,
  Cpu,
  Blocks,
  Terminal,
  HeartHandshake,
  AlertTriangle,
} from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { SectionTitle } from "@/components/ui/section-title";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#020617] text-[#f8fafc] overflow-hidden pb-20">

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 flex flex-col items-center">
          <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-white leading-tight">
            About IT Jobs Nepal
          </h1>
          <p className="text-slate-300 font-sans text-base sm:text-lg max-w-2xl leading-relaxed">
            A community-driven, developer-first platform built to{" "}
            <strong className="text-secondary font-semibold">unify</strong> the
            fragmented tech job market in Nepal. Simple, fast, and completely free.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {/* Card 1: Purpose */}
          <section className="group relative bg-[#0f172a] border border-white/10 rounded-3xl p-8 hover:border-secondary/40 transition-all duration-300 hover:-translate-y-1 shadow-premium overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
              <Target size={80} className="text-white" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#1e293b] border border-white/10 flex items-center justify-center mb-6 text-secondary shadow-inner">
                <Flag size={20} />
              </div>
              <h2 className="font-sans text-2xl font-bold mb-4 text-white">
                Project Purpose
              </h2>
              <div className="space-y-4 font-sans text-slate-300 text-sm leading-relaxed">
                <p>
                  Navigating the tech career market in Nepal usually requires monitoring
                  dozens of separate career portals, LinkedIn groups, and local boards.
                  <strong className="text-white font-semibold"> IT Jobs Nepal </strong>
                  automatically centralizes openings into a single, lightning-fast developer hub.
                </p>
                <p>
                  Our goal is to make job discovery transparent and effortless with a clean,
                  ad-free interface built with modern web technologies.
                </p>
              </div>
            </div>
          </section>

          {/* Card 2: How It Works */}
          <section className="group relative bg-[#0f172a] border border-white/10 rounded-3xl p-8 hover:border-secondary/40 transition-all duration-300 hover:-translate-y-1 shadow-premium overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
              <Cpu size={80} className="text-white" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#1e293b] border border-white/10 flex items-center justify-center mb-6 text-secondary shadow-inner">
                <Blocks size={20} />
              </div>
              <h2 className="font-sans text-2xl font-bold mb-4 text-white">
                How It Works
              </h2>
              <p className="font-sans text-slate-300 text-sm leading-relaxed mb-4">
                Automated background spiders continuously scrape and categorize tech vacancies from:
              </p>
              <ul className="space-y-3 font-sans text-slate-300 text-sm">
                {[
                  "100+ verified Nepal company career portals",
                  "Major national employment portals (Kumarijob, JobsNepal)",
                  "LinkedIn Jobs Nepal regional stream",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Card 3: Open Source (Full width) */}
          <section className="md:col-span-2 group relative bg-[#0f172a] border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden hover:border-secondary/40 transition-all duration-300 shadow-premium">
            <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-all duration-700 pointer-events-none hidden md:block">
              <Terminal size={160} className="text-white" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="flex-1">
                <h2 className="font-sans text-2xl sm:text-3xl font-extrabold mb-4 text-white">
                  Built by the Community for Nepal&apos;s Tech Talent
                </h2>
                <p className="font-sans text-slate-300 text-sm sm:text-base mb-6 leading-relaxed">
                  This platform is fully open source under the MIT License. We believe in transparency and community collaboration. No accounts, no paywalls, no tracking.
                </p>
                <a
                  href="https://github.com/sarozpradhan64/IT-jobs-in-nepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-primary hover:bg-[#7555e0] text-white px-8 py-3.5 rounded-xl font-sans font-semibold text-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-300 shadow-premium"
                >
                  <SiGithub size={18} />
                  <span>Contribute on GitHub</span>
                </a>
              </div>
            </div>
          </section>

          {/* Card 4: Disclaimer (Full width) */}
          <section className="md:col-span-2 bg-[#0f172a]/70 border border-amber-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-5 items-start md:items-center shadow-premium">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h2 className="font-sans text-lg font-bold text-amber-300 mb-1">
                Notice &amp; Disclaimer
              </h2>
              <p className="font-sans text-slate-300 text-xs sm:text-sm leading-relaxed">
                IT Jobs Nepal operates strictly as an automated aggregator. We do not host job applications directly. Clicking &quot;Apply&quot; redirects you to the company&apos;s original career board. Always verify the authenticity of job listings before submitting sensitive personal details.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
