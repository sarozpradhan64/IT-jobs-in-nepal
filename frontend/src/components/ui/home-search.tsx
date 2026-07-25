"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <form
      onSubmit={handleSearch}
      className="grow flex flex-col md:flex-row items-stretch gap-2"
    >
      <div className="grow flex items-center px-4 gap-3 bg-surface-container-low rounded-xl">
        <Search size={20} className="text-outline shrink-0" />
        <input
          className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-sans py-4 outline-none placeholder:text-outline"
          placeholder="Search roles, tech, or companies..."
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-on-primary px-8 py-4 rounded-xl font-sans font-bold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        Find My Next Role
      </button>
    </form>
  );
}
