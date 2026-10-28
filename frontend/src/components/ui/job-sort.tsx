"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

export function JobSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort_by") || "date";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort_by", e.target.value);
    router.push(pathname + "?" + params.toString());
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={currentSort}
        onChange={handleChange}
        className="appearance-none bg-[#1e293b]/80 border border-white/10 text-white font-sans text-xs sm:text-sm rounded-xl focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 outline-none py-2 pl-3.5 pr-8 cursor-pointer hover:bg-[#1e293b] transition-colors"
      >
        <option value="date" className="bg-[#0f172a] text-white">Latest (Date)</option>
        <option value="salary" className="bg-[#0f172a] text-white">Salary</option>
        <option value="title" className="bg-[#0f172a] text-white">Title</option>
      </select>
      <ChevronDown
        size={14}
        className="absolute right-2.5 pointer-events-none text-secondary"
      />
    </div>
  );
}
