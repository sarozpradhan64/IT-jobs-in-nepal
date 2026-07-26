import Link from "next/link";
import React from "react";

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
          className="border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg font-sans font-medium text-sm hover:bg-surface-variant hover:border-primary/50 transition-all shadow-sm"
        >
          Prev
        </Link>
      ) : (
        <button
          disabled
          className="border border-outline-variant/20 text-on-surface-variant/50 px-4 py-2 rounded-lg font-sans font-medium text-sm cursor-not-allowed"
        >
          Prev
        </button>
      )}

      <div className="flex items-center gap-1 mx-2">
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNum = i + 1;
          // Show first, last, current, and adjacent pages
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
                className={`w-9 h-9 flex items-center justify-center rounded-lg font-sans text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-on-primary shadow-sm pointer-events-none"
                    : "text-on-surface hover:bg-surface-variant border border-transparent hover:border-outline-variant/50"
                }`}
              >
                {pageNum}
              </Link>
            );
          }

          // Show ellipsis for gaps
          if (
            (pageNum === 2 && currentPage > 3) ||
            (pageNum === totalPages - 1 && currentPage < totalPages - 2)
          ) {
            return (
              <span key={pageNum} className="text-on-surface-variant px-1">
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
          className="border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg font-sans font-medium text-sm hover:bg-surface-variant hover:border-primary/50 transition-all shadow-sm"
        >
          Next
        </Link>
      ) : (
        <button
          disabled
          className="border border-outline-variant/20 text-on-surface-variant/50 px-4 py-2 rounded-lg font-sans font-medium text-sm cursor-not-allowed"
        >
          Next
        </button>
      )}
    </div>
  );
}
