import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck } from "lucide-react";

import type { CheckIn } from "../types/CheckIn";
import CheckInTable from "../components/checkin/CheckInTable";
import CheckInTableSkeleton from "../components/checkin/CheckInTableSkeleton";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import ConfirmModal from "../components/ui/ConfirmModel";
import { getTodayCheckIns } from "../api/checkins.api.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBookingStatus } from "../api/checkins.api.ts";
import { useToast } from "../context/ToastContext.tsx";
const ITEMS_PER_PAGE = 4;

function dateOnly(iso: string) {
  return iso.split("T")[0];
}

function nightsBetween(from: string, to: string) {
  const d1 = new Date(from);
  const d2 = new Date(to);
  return Math.max(1, Math.round((d2.getTime() - d1.getTime()) / 86400000));
}

export default function CheckInPage() {
  const [page, setPage] = useState(1);
  const { showToast } = useToast();

  const {
    data: checkins = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["checkins", "today"],
    queryFn: getTodayCheckIns,
    select: (res): CheckIn[] =>
      res.data.map((b) => ({
        id: String(b.booking_id),
        guestName: b.users.name,
        roomType: b.rooms.room_name,
        status: b.status,
        bookingDate: dateOnly(b.check_in),
        adults: b.adults,
        children: b.children,
        nights: nightsBetween(b.check_in, b.check_out),
        fromDate: dateOnly(b.check_in),
        toDate: dateOnly(b.check_out),
      })),
  });

  const queryClient = useQueryClient();

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{
    open: boolean;
    id: string | null;
    action: "check-in" | "not-checked-in";
  }>({ open: false, id: null, action: "check-in" });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateBookingStatus(id, status),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["checkins", "today"] });
      setUpdatingId(null);
      setConfirm({ open: false, id: null, action: "check-in" });
      showToast("success", response.message);
    },
    onError: () => {
      setUpdatingId(null);
    },
  });

  const handleConfirmAction = () => {
    if (!confirm.id) return;
    setUpdatingId(confirm.id);
    const status = confirm.action === "check-in" ? "checked in" : "confirmed";
    updateMutation.mutate({ id: confirm.id, status });
  };

  const totalPages = Math.ceil(checkins.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return checkins.slice(start, start + ITEMS_PER_PAGE);
  }, [page, checkins]);

  if (isError) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-serif text-[#F5DEB3]">Check-ins</h1>
        <p className="text-red-400">
          {(error as Error)?.message || "Failed to load today's check-ins"}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-serif text-[#F5DEB3]">Today's Check-ins</h1>

      {isLoading ? (
        <CheckInTableSkeleton />
      ) : checkins.length === 0 ? (
        <div className="rounded-xl border border-[#3A1A22] bg-linear-to-b from-[#241217] to-[#1F1216] p-6">
          <EmptyState
            title="No check-ins today"
            description="Looks like there are no guests scheduled to check-in today."
            icon={<CalendarCheck className="h-8 w-8 text-[#D4AF37]" />}
          />
        </div>
      ) : (
        <>
          <CheckInTable
            checkins={paginated}
            updatingId={updatingId}
            onCheckIn={(id) =>
              setConfirm({ open: true, id, action: "check-in" })
            }
            onNotCheckedIn={(id) =>
              setConfirm({ open: true, id, action: "not-checked-in" })
            }
          />

          <ConfirmModal
            open={confirm.open}
            title={
              confirm.action === "check-in"
                ? "Confirm check-in?"
                : "Confirm not checked-in?"
            }
            description={
              confirm.action === "check-in"
                ? "Mark this guest as checked in?"
                : "Confirm that this guest has not checked in. Booking will remain as confirmed."
            }
            confirmText={
              updateMutation.isPending ? "Updating..." : "Yes, confirm"
            }
            cancelText="Cancel"
            onCancel={() =>
              setConfirm({ open: false, id: null, action: "check-in" })
            }
            onConfirm={handleConfirmAction}
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
