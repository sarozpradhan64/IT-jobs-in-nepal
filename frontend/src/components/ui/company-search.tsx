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
    <div className="glass-panel p-2 rounded-2xl flex flex-col md:flex-row items-stretch gap-2 shadow-sm mb-lg max-w-3xl">
      <div className="grow flex items-center px-4 gap-3 bg-surface-container-low rounded-xl">
        <Search size={20} className="text-outline shrink-0" />
        <input
          type="text"
          placeholder="Search companies by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-sans py-4 outline-none placeholder:text-outline"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-outline hover:text-on-surface transition-colors shrink-0"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
