import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Plus } from "lucide-react";

import Pagination from "../components/ui/Pagination";
import BookingsTable from "../components/bookings/BookingsTable";
import BookingsTableSkeleton from "../components/bookings/BookingTableSkeleton";
import EmptyState from "../components/ui/EmptyState";
import ConfirmModal from "../components/ui/ConfirmModel";
import { useToast } from "../context/ToastContext";

import type { BookingRow } from "../types/BookingRow";
import { getUpcomingBookings, cancelBooking } from "../api/bookings.api";
const ITEMS_PER_PAGE = 4;

function daysBetween(fromISO: string, toISO: string) {
  const from = new Date(fromISO);
  const to = new Date(toISO);
  const diffMs = to.getTime() - from.getTime();
  return Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

function toDateOnly(iso: string) {
  return iso?.split("T")?.[0] ?? iso;
}

export default function BookingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [cancelConfirm, setCancelConfirm] = useState<{
    open: boolean;
    id: string | null;
  }>({
    open: false,
    id: null,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "upcoming"] });
      queryClient.invalidateQueries({ queryKey: ["calendarBookings"] });
      showToast("success", "Booking cancelled");
      setCancelConfirm({ open: false, id: null });
    },
    onError: (err: Error) => {
      showToast("error", err.message || "Failed to cancel booking");
    },
  });

  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["bookings", "upcoming"],
    queryFn: getUpcomingBookings,
    select: (response): BookingRow[] =>
      response.data.map((b) => ({
        id: String(b.booking_id),
        room_id: b.rooms?.room_id ?? 0,
        guestName: b.users?.name ?? "Unknown",
        roomType: b.rooms?.room_type ?? "-",
        roomName: b.rooms?.room_name ?? "-",
        status: (b.status as BookingRow["status"]) || "upcoming",
        bookingDate: toDateOnly(b.created_at),
        adults: b.adults ?? 0,
        children: b.children ?? 0,
        nights: daysBetween(b.check_in, b.check_out),
        fromDate: toDateOnly(b.check_in),
        toDate: toDateOnly(b.check_out),
      })),
  });

  // Reset page when data changes (defer setState to avoid cascading renders)
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setPage(1);
    });
    return () => {
      cancelled = true;
    };
  }, [bookings.length]);

  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return bookings.slice(start, start + ITEMS_PER_PAGE);
  }, [page, bookings]);

  /* ---------------- Loading ---------------- */
  if (isLoading) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-serif text-[#F5DEB3]">Bookings</h1>
        <BookingsTableSkeleton />
      </section>
    );
  }

  /* ---------------- Error ---------------- */
  if (isError) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-serif text-[#F5DEB3]">Bookings</h1>
        <p className="text-red-400">
          {(error as Error)?.message || "Failed to load bookings"}
        </p>
      </section>
    );
  }

  /* ---------------- Page ----------------- */
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-serif text-[#F5DEB3]">Bookings</h1>
        <button
          type="button"
          onClick={() => navigate("/bookings/new")}
          className="flex items-center gap-2 rounded-md border border-[#D4AF37] bg-[#D4AF37]/10 px-4 py-2 text-sm font-medium text-[#F5DEB3] transition-colors hover:border-[#D4AF37] hover:bg-[#D4AF37]/20"
        >
          <Plus className="h-4 w-4" />
          Create booking
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-[#3A1A22] bg-linear-to-b from-[#241217] to-[#1F1216] p-6">
          <EmptyState
            title="No upcoming bookings"
            description="There are currently no upcoming bookings."
            icon={<CalendarDays className="h-8 w-8 text-[#D4AF37]" />}
          />
        </div>
      ) : (
        <>
          <BookingsTable
            bookings={paginated}
            onCancel={(id) => setCancelConfirm({ open: true, id })}
            onReschedule={(booking) =>
              navigate(`/bookings/${booking.id}/reschedule`)
            }
          />

          <ConfirmModal
            open={cancelConfirm.open}
            title="Cancel booking?"
            description="This will cancel the booking. This action cannot be undone."
            confirmText={
              cancelMutation.isPending ? "Cancelling…" : "Yes, cancel booking"
            }
            cancelText="Keep booking"
            destructive
            onCancel={() => setCancelConfirm({ open: false, id: null })}
            onConfirm={() =>
              cancelConfirm.id && cancelMutation.mutate(cancelConfirm.id)
            }
          />

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </section>
  );
}
