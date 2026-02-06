import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 pt-4">
      {/* Prev */}
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="
          inline-flex items-center gap-1 rounded-md
          border border-[#3A1A22] px-3 py-1.5
          text-sm text-[#F5DEB3]/70
          hover:border-[#D4AF37] hover:text-[#D4AF37]
          disabled:opacity-40 disabled:cursor-not-allowed
        "
      >
        <ChevronLeft size={16} />
        Prev
      </button>

      {/* Pages */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          const active = p === page;

          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`
                h-9 w-9 rounded-md text-sm font-medium transition
                ${
                  active
                    ? "bg-[#D4AF37] text-[#1B0F12]"
                    : "border border-[#3A1A22] text-[#F5DEB3]/70 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                }
              `}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="
          inline-flex items-center gap-1 rounded-md
          border border-[#3A1A22] px-3 py-1.5
          text-sm text-[#F5DEB3]/70
          hover:border-[#D4AF37] hover:text-[#D4AF37]
          disabled:opacity-40 disabled:cursor-not-allowed
        "
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
