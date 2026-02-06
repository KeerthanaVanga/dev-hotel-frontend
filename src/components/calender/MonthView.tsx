import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
} from "date-fns";
import type { CalendarBooking } from "../../types/CalenderBooking";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function inRange(day: string, from: string, to: string) {
  // day/from/to are YYYY-MM-DD
  return day >= from && day <= to;
}

export default function MonthView({
  bookings,
  monthDate,
}: {
  bookings: CalendarBooking[];
  monthDate: Date;
}) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);

  // full grid from Monday-start to Sunday-end
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div className="rounded-xl border border-[#3A1A22] bg-[#241217] overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-[#3A1A22]">
        {DAYS.map((d) => (
          <div key={d} className="px-3 py-2 text-sm text-[#F5DEB3]/60">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd");
          const dayBookings = bookings.filter((b) =>
            inRange(dayKey, b.fromDate, b.toDate),
          );

          return (
            <div
              key={dayKey}
              className={`min-h-30 border-r border-b border-[#3A1A22] p-2 ${
                isSameMonth(day, monthDate) ? "" : "opacity-40"
              }`}
            >
              <span className="text-xs text-[#F5DEB3]/50">
                {format(day, "d")}
              </span>

              <div className="mt-2 space-y-1">
                {dayBookings.slice(0, 3).map((b) => (
                  <div
                    key={`${b.id}-${dayKey}`}
                    className="rounded-md bg-[#3A1A22]/70 px-2 py-1 text-xs text-[#F5DEB3]"
                    title={`${b.guestName} • ${b.roomType} • ${b.fromDate} → ${b.toDate}`}
                  >
                    {b.guestName}
                  </div>
                ))}

                {dayBookings.length > 3 && (
                  <div className="text-[11px] text-[#D4AF37]/90">
                    +{dayBookings.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
