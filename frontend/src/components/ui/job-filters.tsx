"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, Check } from "lucide-react";

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

export function JobFilters({
  categories = [],
}: {
  categories?: { id: number; slug: string; name: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;
  const isMounted = useRef(false);

  const buildQuery = (name: string, value: string) => {
    const params = new URLSearchParams(searchParamsRef.current.toString());
    if (value) params.set(name, value);
    else params.delete(name);
    return params.toString();
  };

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const qs = buildQuery("q", debouncedSearchTerm);
    router.push(pathname + (qs ? "?" + qs : ""));
  }, [debouncedSearchTerm, router, pathname]);

  const handleCheckbox = (name: string, value: string, checked: boolean) => {
    const current = searchParamsRef.current.get(name) ?? "";
    let updated = current ? current.split(",") : [];
    if (checked) {
      if (!updated.includes(value)) updated.push(value);
    } else {
      updated = updated.filter((v) => v !== value);
    }
    const qs = buildQuery(name, updated.join(","));
    router.push(pathname + (qs ? "?" + qs : ""));
  };

  const isChecked = (name: string, value: string) => {
    const current = searchParams.get(name) ?? "";
    return current.split(",").includes(value);
  };

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <div>
        <label className="block font-sans text-sm font-semibold text-on-surface mb-3">
          Search Jobs
        </label>
        <div className="flex items-center px-4 gap-3 bg-surface rounded-xl border border-outline-variant/40 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search size={16} className="text-outline group-focus-within:text-primary transition-colors shrink-0" />
          <input
            type="text"
            placeholder="e.g. React, Python, UI/UX"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-sans py-3 outline-none text-sm placeholder:text-outline/50"
          />
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />

      {/* Category Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="font-sans text-sm font-semibold text-on-surface">
            Category
          </label>
          <span className="text-xs font-mono text-outline px-2 py-0.5 bg-surface-variant rounded-full">
            {categories.length}
          </span>
        </div>
        <div className="space-y-0.5 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
          {categories.map((cat) => (
            <label
              key={cat.slug}
              className="flex items-center gap-3 cursor-pointer group py-1.5 px-2 rounded-lg hover:bg-surface-variant/50 transition-colors"
            >
              <div className="relative w-5 h-5 shrink-0">
                <input
                  type="checkbox"
                  checked={isChecked("category", cat.slug)}
                  onChange={(e) =>
                    handleCheckbox("category", cat.slug, e.target.checked)
                  }
                  className="peer appearance-none w-5 h-5 rounded border border-outline-variant/50 bg-surface checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors cursor-pointer"
                />
                <Check
                  size={12}
                  strokeWidth={3}
                  className="absolute inset-0 m-auto text-on-primary pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                />
              </div>
              <span className="font-sans text-sm text-on-surface-variant group-hover:text-on-surface transition-colors flex-grow">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />

      {/* Work Setup Filter */}
      <div>
        <label className="block font-sans text-sm font-semibold text-on-surface mb-3">
          Work Setup
        </label>
        <div className="space-y-0.5">
          {["Onsite", "Hybrid", "Remote"].map((setup) => (
            <label
              key={setup}
              className="flex items-center gap-3 cursor-pointer group py-1.5 px-2 rounded-lg hover:bg-surface-variant/50 transition-colors"
            >
              <div className="relative w-5 h-5 shrink-0">
                <input
                  type="checkbox"
                  checked={isChecked("remote_status", setup.toLowerCase())}
                  onChange={(e) =>
                    handleCheckbox(
                      "remote_status",
                      setup.toLowerCase(),
                      e.target.checked,
                    )
                  }
                  className="peer appearance-none w-5 h-5 rounded border border-outline-variant/50 bg-surface checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors cursor-pointer"
                />
                <Check
                  size={12}
                  strokeWidth={3}
                  className="absolute inset-0 m-auto text-on-primary pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                />
              </div>
              <span className="font-sans text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                {setup}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
