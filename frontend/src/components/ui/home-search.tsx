"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function HomeSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/jobs?q=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push("/jobs");
    }
  };

  return (
    <form onSubmit={handleSearch} className="grow flex flex-col sm:flex-row items-stretch gap-1.5">
      <div className="grow flex items-center px-4 gap-3 bg-surface-container rounded-xl">
        <Search size={17} className="text-outline shrink-0" />
        <input
          className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-sans py-3.5 outline-none placeholder:text-on-surface-variant/60 text-sm"
          placeholder="Search roles, tech, or companies…"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-on-primary px-7 py-3.5 rounded-xl font-sans font-semibold text-sm hover:opacity-90 active:scale-95 transition-all"
      >
        Search Jobs
      </button>
    </form>
  );
}
