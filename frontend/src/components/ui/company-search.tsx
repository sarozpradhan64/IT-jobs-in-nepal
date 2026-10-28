"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

function useDebounce<T>(value: T, delay: number): [T] {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return [debouncedValue];
}

export function CompanySearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 400);

  const isMounted = useRef(false);
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const params = new URLSearchParams(searchParamsRef.current.toString());
    if (debouncedSearchTerm) {
      params.set("q", debouncedSearchTerm);
    } else {
      params.delete("q");
    }
    const qs = params.toString();
    router.push(pathname + (qs ? "?" + qs : ""));
  }, [debouncedSearchTerm, router, pathname]);

  return (
    <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-premium mb-10 max-w-3xl">
      <div className="grow flex items-center px-4 gap-3 bg-[#1e293b]/70 border border-white/5 rounded-xl focus-within:border-secondary/50 focus-within:ring-1 focus-within:ring-secondary/20 transition-all">
        <Search size={18} className="text-secondary shrink-0" />
        <input
          type="text"
          placeholder="Search companies by name or technology..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 text-white font-sans py-3.5 outline-none placeholder:text-slate-400 text-sm"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-slate-400 hover:text-white transition-colors shrink-0 p-1"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
