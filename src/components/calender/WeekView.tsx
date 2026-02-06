import { startOfWeek, endOfWeek, eachDayOfInterval, format } from "date-fns";
import type { CalendarBooking } from "../../types/CalenderBooking";

function inRange(day: string, from: string, to: string) {
  return day >= from && day <= to;
}

export default function WeekView({
  bookings,
  weekDate,
}: {
  bookings: CalendarBooking[];
  weekDate: Date;
}) {
  const weekStart = startOfWeek(weekDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(weekDate, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4 space-y-4">
      {days.map((d) => {
        const key = format(d, "yyyy-MM-dd");
        const dayBookings = bookings.filter((b) =>
          inRange(key, b.fromDate, b.toDate),
        );

        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#F5DEB3]">
                {format(d, "EEE, dd MMM")}
              </p>
              <p className="text-xs text-[#F5DEB3]/50">
                {dayBookings.length} booking(s)
              </p>
            </div>

            {dayBookings.length === 0 ? (
              <div className="rounded-lg border border-[#3A1A22] bg-[#1F1216] p-3 text-sm text-[#F5DEB3]/60">
                No bookings
              </div>
            ) : (
              <div className="space-y-3">
                {dayBookings.map((b) => (
                  <div
                    key={`${b.id}-${key}`}
                    className="rounded-lg border border-[#3A1A22] bg-[#1F1216] p-3"
                  >
                    <p className="font-medium text-[#F5DEB3]">{b.guestName}</p>
                    <p className="text-sm text-[#F5DEB3]/70">{b.roomType}</p>
                    <p className="text-xs text-[#F5DEB3]/50">
                      {b.fromDate} → {b.toDate}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
