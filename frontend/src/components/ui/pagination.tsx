import Link from "next/link";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  getPaginationUrl: (page: number) => string;
}

export function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  getPaginationUrl,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex justify-center items-center gap-2">
      {currentPage > 1 ? (
        <Link
          href={getPaginationUrl(currentPage - 1)}
          className="inline-flex items-center gap-1 border border-white/10 bg-[#0f172a] text-slate-300 px-4 py-2 rounded-xl font-sans font-medium text-xs sm:text-sm hover:text-white hover:border-secondary/40 transition-all shadow-sm"
        >
          <ChevronLeft size={14} />
          <span>Prev</span>
        </Link>
      ) : (
        <button
          disabled
          className="inline-flex items-center gap-1 border border-white/5 bg-[#0f172a]/40 text-slate-600 px-4 py-2 rounded-xl font-sans font-medium text-xs sm:text-sm cursor-not-allowed"
        >
          <ChevronLeft size={14} />
          <span>Prev</span>
        </button>
      )}

      <div className="flex items-center gap-1.5 mx-2">
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNum = i + 1;
          if (
            pageNum === 1 ||
            pageNum === totalPages ||
            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
          ) {
            const isActive = pageNum === currentPage;
            return (
              <Link
                key={pageNum}
                href={getPaginationUrl(pageNum)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-secondary text-[#020617] shadow-md shadow-secondary/20 pointer-events-none"
                    : "text-slate-300 hover:text-white hover:bg-[#1e293b] border border-white/10"
                }`}
              >
                {pageNum}
              </Link>
            );
          }

          if (
            (pageNum === 2 && currentPage > 3) ||
            (pageNum === totalPages - 1 && currentPage < totalPages - 2)
          ) {
            return (
              <span key={pageNum} className="text-slate-500 px-1 font-mono text-xs">
                ...
              </span>
            );
          }

          return null;
        })}
      </div>

      {hasNextPage ? (
        <Link
          href={getPaginationUrl(currentPage + 1)}
          className="inline-flex items-center gap-1 border border-white/10 bg-[#0f172a] text-slate-300 px-4 py-2 rounded-xl font-sans font-medium text-xs sm:text-sm hover:text-white hover:border-secondary/40 transition-all shadow-sm"
        >
          <span>Next</span>
          <ChevronRight size={14} />
        </Link>
      ) : (
        <button
          disabled
          className="inline-flex items-center gap-1 border border-white/5 bg-[#0f172a]/40 text-slate-600 px-4 py-2 rounded-xl font-sans font-medium text-xs sm:text-sm cursor-not-allowed"
        >
          <span>Next</span>
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
