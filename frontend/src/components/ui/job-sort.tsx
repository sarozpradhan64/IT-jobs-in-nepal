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
        className="appearance-none bg-surface border border-outline-variant/30 text-on-surface font-sans text-sm rounded-lg focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none py-2 pl-4 pr-9 cursor-pointer hover:bg-surface-variant/30 transition-colors"
      >
        <option value="date" className="bg-surface text-on-surface">Latest (Date)</option>
        <option value="salary" className="bg-surface text-on-surface">Salary</option>
        <option value="title" className="bg-surface text-on-surface">Title</option>
      </select>
      <ChevronDown
        size={15}
        className="absolute right-2.5 pointer-events-none text-outline-variant"
      />
    </div>
  );
}
