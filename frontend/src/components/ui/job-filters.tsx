"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

function useDebounce<T>(value: T, delay: number): [T] {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue];
}

export function JobFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for search to debounce
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);


  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  // Update query on debounce
  useEffect(() => {
    router.push(pathname + "?" + createQueryString("q", debouncedSearchTerm));
  }, [debouncedSearchTerm, router, pathname, createQueryString]);

  const handleCheckbox = (name: string, value: string, checked: boolean) => {
    // Current query might have multiple values for a field (e.g., employment_type=full-time,part-time)
    // For simplicity, let's just toggle single values or rewrite the param.
    // In our backend, usually employment_type / remote_status are single strings in the query for simple matching
    const current = searchParams.get(name) ?? "";
    let updated = [];
    if (current) {
      updated = current.split(",");
    }

    if (checked) {
      updated.push(value);
    } else {
      updated = updated.filter((v) => v !== value);
    }

    const newValue = updated.join(",");
    router.push(pathname + "?" + createQueryString(name, newValue));
  };

  const isChecked = (name: string, value: string) => {
    const current = searchParams.get(name) ?? "";
    return current.split(",").includes(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-mono text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-2">Search</h4>
        <div className="flex items-center px-3 gap-2 bg-surface-variant rounded-lg border border-outline-variant/30">
          <span className="material-symbols-outlined text-outline text-sm">search</span>
          <input
            type="text"
            placeholder="e.g. React, Python"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-sans py-2 outline-none text-sm placeholder:text-outline/70"
          />
        </div>
      </div>

      <div>
        <h4 className="font-mono text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-2">Role Type</h4>
        <div className="space-y-2">
          {["Frontend", "Backend", "Fullstack", "DevOps", "Data", "Design"].map((role) => (
            <label key={role} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={isChecked("role", role.toLowerCase())}
                onChange={(e) => handleCheckbox("role", role.toLowerCase(), e.target.checked)}
                className="rounded border-outline-variant/30 bg-surface text-primary focus:ring-primary/20 cursor-pointer"
              />
              <span className="font-sans text-sm group-hover:text-primary transition-colors">{role}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-mono text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-2">Work Setup</h4>
        <div className="space-y-2">
          {["Onsite", "Hybrid", "Remote"].map((setup) => (
            <label key={setup} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={isChecked("remote_status", setup.toLowerCase())}
                onChange={(e) => handleCheckbox("remote_status", setup.toLowerCase(), e.target.checked)}
                className="rounded border-outline-variant/30 bg-surface text-primary focus:ring-primary/20 cursor-pointer"
              />
              <span className="font-sans text-sm group-hover:text-primary transition-colors">{setup}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
