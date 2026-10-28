"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

const SOURCES = [
  ["kumarijob", "Kumarijob"],
  ["jobsnepal", "JobsNepal"],
  ["linkedin", "LinkedIn"],
  ["career_page", "Career Page"],
] as const;

export function SourceFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = searchParams.get("source") || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) params.set("source", e.target.value);
    else params.delete("source");
    params.delete("page");
    router.push(pathname + "?" + params.toString());
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={current}
        onChange={handleChange}
        className="appearance-none bg-[#1e293b]/80 border border-white/10 text-white font-sans text-xs sm:text-sm rounded-xl focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 outline-none py-2 pl-3.5 pr-8 cursor-pointer hover:bg-[#1e293b] transition-colors"
      >
        <option value="" className="bg-[#0f172a] text-white">All Sources</option>
        {SOURCES.map(([value, label]) => (
          <option
            key={value}
            value={value}
            className="bg-[#0f172a] text-white"
          >
            {label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-2.5 pointer-events-none text-secondary"
      />
    </div>
  );
}
