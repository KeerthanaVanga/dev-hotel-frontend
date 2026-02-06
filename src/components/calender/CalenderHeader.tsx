interface Props {
  title: string;
  view: "month" | "week";
  onViewChange: (v: "month" | "week") => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function CalendarHeader({
  title,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-serif text-[#F5DEB3]">{title}</h1>

        <button
          onClick={onToday}
          className="rounded-md border border-[#3A1A22] bg-[#241217] px-3 py-2 text-sm text-[#F5DEB3]/80 hover:border-[#D4AF37]"
        >
          Today
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="rounded-md border border-[#3A1A22] bg-[#241217] px-3 py-2 text-sm text-[#F5DEB3]/80 hover:border-[#D4AF37]"
        >
          Prev
        </button>
        <button
          onClick={onNext}
          className="rounded-md border border-[#3A1A22] bg-[#241217] px-3 py-2 text-sm text-[#F5DEB3]/80 hover:border-[#D4AF37]"
        >
          Next
        </button>

        <div className="inline-flex rounded-lg border border-[#3A1A22] bg-[#241217] p-1">
          <button
            onClick={() => onViewChange("month")}
            className={`
      rounded-md px-4 py-1.5 text-sm font-medium transition
      ${
        view === "month"
          ? "bg-[#D4AF37] text-[#1B0F12]"
          : "text-[#F5DEB3]/70 hover:text-[#F5DEB3]"
      }
    `}
          >
            Month
          </button>

          <button
            onClick={() => onViewChange("week")}
            className={`
      rounded-md px-4 py-1.5 text-sm font-medium transition
      ${
        view === "week"
          ? "bg-[#D4AF37] text-[#1B0F12]"
          : "text-[#F5DEB3]/70 hover:text-[#F5DEB3]"
      }
    `}
          >
            Week
          </button>
        </div>
      </div>
    </div>
  );
}
