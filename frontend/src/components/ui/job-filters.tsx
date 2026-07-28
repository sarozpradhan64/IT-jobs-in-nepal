"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, Check } from "lucide-react";

function useDebounce<T>(value: T, delay: number): [T] {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
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

  const spRef = useRef(searchParams);
  spRef.current = searchParams;
  const mounted = useRef(false);

  const buildQuery = (name: string, value: string) => {
    const p = new URLSearchParams(spRef.current.toString());
    if (value) p.set(name, value);
    else p.delete(name);
    p.delete("page");
    return p.toString();
  };

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    const qs = buildQuery("q", debouncedSearchTerm);
    router.push(pathname + (qs ? "?" + qs : ""));
    window.scrollTo({ top: 0, behavior: "smooth" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const handleCheckbox = (name: string, value: string, checked: boolean) => {
    const current = spRef.current.get(name) ?? "";
    let list = current ? current.split(",") : [];
    if (checked) { if (!list.includes(value)) list.push(value); }
    else { list = list.filter((v) => v !== value); }
    const qs = buildQuery(name, list.join(","));
    router.push(pathname + (qs ? "?" + qs : ""));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isChecked = (name: string, value: string) =>
    (searchParams.get(name) ?? "").split(",").includes(value);

  /* ── Shared class strings ── */
  const checkboxCls =
    "peer appearance-none w-4 h-4 rounded border border-outline bg-surface checked:bg-primary checked:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none transition-colors cursor-pointer shrink-0";
  const rowCls =
    "flex items-center gap-3 cursor-pointer group py-1.5 px-2 rounded-lg hover:bg-surface-container-high transition-colors";
  const labelCls =
    "font-sans text-xs text-on-surface-variant group-hover:text-on-surface transition-colors flex-grow";
  const sectionLabelCls =
    "block font-mono text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-3";
  const dividerCls = "h-px w-full bg-outline-variant my-1";

  return (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label className={sectionLabelCls}>Search</label>
        <div className="flex items-center gap-2 px-3 bg-surface rounded-lg border border-outline-variant focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          <Search size={14} className="text-outline shrink-0" />
          <input
            type="text"
            placeholder="Role, skill, company…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-sans py-2.5 outline-none text-sm placeholder:text-outline/60"
          />
        </div>
      </div>

      <div className={dividerCls} />

      {/* Category */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={sectionLabelCls}>Category</label>
          <span className="font-mono text-xs text-outline">{categories.length}</span>
        </div>
        <div className="space-y-0.5 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
          {categories.map((cat) => (
            <label key={cat.slug} className={rowCls}>
              <div className="relative shrink-0">
                <input
                  type="checkbox"
                  checked={isChecked("category", cat.slug)}
                  onChange={(e) => handleCheckbox("category", cat.slug, e.target.checked)}
                  className={checkboxCls}
                />
                <Check
                  size={10}
                  strokeWidth={3}
                  className="absolute inset-0 m-auto text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                />
              </div>
              <span className={labelCls}>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={dividerCls} />

      {/* Work Setup */}
      <div>
        <label className={sectionLabelCls}>Work Setup</label>
        <div className="space-y-0.5">
          {(["Onsite", "Hybrid", "Remote"] as const).map((setup) => (
            <label key={setup} className={rowCls}>
              <div className="relative shrink-0">
                <input
                  type="checkbox"
                  checked={isChecked("remote_status", setup.toLowerCase())}
                  onChange={(e) => handleCheckbox("remote_status", setup.toLowerCase(), e.target.checked)}
                  className={checkboxCls}
                />
                <Check size={10} strokeWidth={3} className="absolute inset-0 m-auto text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className={labelCls}>{setup}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={dividerCls} />

      {/* Employment Type */}
      <div>
        <label className={sectionLabelCls}>Employment Type</label>
        <div className="space-y-0.5">
          {([
            ["full-time", "Full-time"],
            ["part-time", "Part-time"],
            ["contract", "Contract"],
            ["internship", "Internship"],
          ] as const).map(([value, label]) => (
            <label key={value} className={rowCls}>
              <div className="relative shrink-0">
                <input
                  type="checkbox"
                  checked={isChecked("employment_type", value)}
                  onChange={(e) => handleCheckbox("employment_type", value, e.target.checked)}
                  className={checkboxCls}
                />
                <Check size={10} strokeWidth={3} className="absolute inset-0 m-auto text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className={labelCls}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={dividerCls} />

      {/* Experience Level */}
      <div>
        <label className={sectionLabelCls}>Experience Level</label>
        <div className="space-y-0.5">
          {([
            ["junior", "Junior"],
            ["mid", "Mid-level"],
            ["senior", "Senior"],
          ] as const).map(([value, label]) => (
            <label key={value} className={rowCls}>
              <div className="relative shrink-0">
                <input
                  type="checkbox"
                  checked={isChecked("experience_level", value)}
                  onChange={(e) => handleCheckbox("experience_level", value, e.target.checked)}
                  className={checkboxCls}
                />
                <Check size={10} strokeWidth={3} className="absolute inset-0 m-auto text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className={labelCls}>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
