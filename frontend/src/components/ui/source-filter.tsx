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
        className="appearance-none bg-surface border border-outline-variant/30 text-on-surface font-sans text-sm rounded-lg focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none py-2 pl-4 pr-9 cursor-pointer hover:bg-surface-variant/30 transition-colors"
      >
        <option value="">All Sources</option>
        {SOURCES.map(([value, label]) => (
          <option
            key={value}
            value={value}
            className="bg-surface text-on-surface"
          >
            {label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        className="absolute right-2.5 pointer-events-none text-outline-variant"
      />
    </div>
  );
}
