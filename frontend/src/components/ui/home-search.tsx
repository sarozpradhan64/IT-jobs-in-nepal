"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

export function HomeSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/jobs?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/jobs");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full flex flex-col sm:flex-row items-stretch gap-2 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-premium"
    >
      <div className="grow flex items-center px-4 gap-3 bg-[#1e293b]/70 border border-white/5 rounded-xl focus-within:border-secondary/50 focus-within:ring-1 focus-within:ring-secondary/20 transition-all">
        <Search size={18} className="text-secondary shrink-0" />
        <input
          className="w-full bg-transparent border-none text-white font-sans py-3.5 outline-none placeholder:text-slate-400 text-sm focus:ring-0"
          placeholder="Search jobs by title, tech stack (React, Python), or company..."
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-primary hover:bg-[#7555e0] text-white px-8 py-3.5 rounded-xl font-sans font-semibold text-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-300 shadow-premium flex items-center justify-center gap-2 cursor-pointer shrink-0"
      >
        <span>Search Jobs</span>
        <ArrowRight size={16} />
      </button>
    </form>
  );
}
