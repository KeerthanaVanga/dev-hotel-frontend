import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
} from "date-fns";

import CalendarHeader from "../components/calender/CalenderHeader";
import MonthView from "../components/calender/MonthView";
import WeekView from "../components/calender/WeekView";
import CalendarSkeleton from "../components/calender/CalenderSkeleton";
import EmptyState from "../components/ui/EmptyState";

import type { CalendarBooking } from "../types/CalenderBooking";
import { getCalendarBookings } from "../api/calender.api";
import { CalendarDays } from "lucide-react";

function toYMD(d: Date) {
  // local date YYYY-MM-DD
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function dateOnly(iso: string) {
  return iso.split("T")[0];
}

export default function CalendarPage() {
  const [view, setView] = useState<"month" | "week">("month");

  // "anchor" date used for month/week navigation
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const title = useMemo(() => format(currentDate, "MMMM yyyy"), [currentDate]);

  // range depends on view:
  const range = useMemo(() => {
    if (view === "month") {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return { from: toYMD(start), to: toYMD(end) };
    }

    // week view (Mon-Sun)
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return { from: toYMD(start), to: toYMD(end) };
  }, [currentDate, view]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["calendarBookings", view, range.from, range.to],
    queryFn: () => getCalendarBookings(range),
    staleTime: 60_000,
    select: (res): CalendarBooking[] =>
      res.data.map((b) => ({
        id: String(b.booking_id),
        guestName: b.users?.name ?? "Unknown",
        roomType: b.rooms?.room_name ?? b.rooms?.room_type ?? "-",
        fromDate: dateOnly(b.check_in),
        toDate: dateOnly(b.check_out),
      })),
  });

  const bookings = data ?? [];

  const onPrev = () => {
    setCurrentDate((d) =>
      view === "month" ? subMonths(d, 1) : new Date(d.getTime() - 7 * 86400000),
    );
  };

  const onNext = () => {
    setCurrentDate((d) =>
      view === "month" ? addMonths(d, 1) : new Date(d.getTime() + 7 * 86400000),
    );
  };

  const onToday = () => setCurrentDate(new Date());

  if (isError) {
    return (
      <section className="space-y-6">
        <CalendarHeader
          title={title}
          view={view}
          onViewChange={setView}
          onPrev={onPrev}
          onNext={onNext}
          onToday={onToday}
        />
        <p className="text-red-400">
          {(error as Error)?.message || "Failed to load calendar bookings"}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <CalendarHeader
        title={title}
        view={view}
        onViewChange={setView}
        onPrev={onPrev}
        onNext={onNext}
        onToday={onToday}
      />

      {isLoading ? (
        <CalendarSkeleton />
      ) : bookings.length === 0 ? (
        <div className="rounded-xl border border-[#3A1A22] bg-linear-to-b from-[#241217] to-[#1F1216] p-6">
          <EmptyState
            title="No bookings in this range"
            description="Try switching to another week/month or create a new booking."
            icon={<CalendarDays className="h-8 w-8 text-[#D4AF37]" />}
          />
        </div>
      ) : view === "month" ? (
        <MonthView bookings={bookings} monthDate={currentDate} />
      ) : (
        <WeekView bookings={bookings} weekDate={currentDate} />
      )}
    </section>
  );
}
