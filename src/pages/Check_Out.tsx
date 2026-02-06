import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarX } from "lucide-react";

import type { CheckOut } from "../types/CheckOut";
import CheckOutTable from "../components/checkout/checkOutTable";
import CheckOutTableSkeleton from "../components/checkout/checkOutTableSkeleton";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import ConfirmModal from "../components/ui/ConfirmModel";
import { getTodayCheckOuts } from "../api/checkout.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBookingStatus } from "../api/checkins.api";
import { useToast } from "../context/ToastContext";
const ITEMS_PER_PAGE = 4;

function dateOnly(iso: string) {
  return iso.split("T")[0];
}

function nightsBetween(from: string, to: string) {
  const d1 = new Date(from);
  const d2 = new Date(to);
  return Math.max(1, Math.round((d2.getTime() - d1.getTime()) / 86400000));
}

export default function CheckOutPage() {
  const [page, setPage] = useState(1);
  const { showToast } = useToast();
  const {
    data: checkouts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["checkouts", "today"],
    queryFn: getTodayCheckOuts,
    select: (res): CheckOut[] =>
      res.data.map((b) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const checkOutDate = new Date(b.check_out);
        checkOutDate.setHours(0, 0, 0, 0);

        const status =
          checkOutDate.getTime() < today.getTime()
            ? "overstayed"
            : b.status === "checked out"
              ? "checked-out"
              : "today";

        return {
          id: String(b.booking_id),
          guestName: b.users.name,
          roomType: b.rooms.room_name,
          status,
          bookingDate: dateOnly(b.check_in),
          adults: b.adults,
          children: b.children,
          nights: nightsBetween(b.check_in, b.check_out),
          fromDate: dateOnly(b.check_in),
          toDate: dateOnly(b.check_out),
        };
      }),
  });

  const queryClient = useQueryClient();

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{
    open: boolean;
    id: string | null;
    action: "check-out" | "not-checked-out";
  }>({ open: false, id: null, action: "check-out" });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateBookingStatus(id, status),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["checkouts", "today"] });
      queryClient.invalidateQueries({ queryKey: ["checkins", "today"] });
      setUpdatingId(null);
      setConfirm({ open: false, id: null, action: "check-out" });
      showToast("success", response.message);
    },
    onError: () => {
      setUpdatingId(null);
    },
  });

  const handleConfirmAction = () => {
    if (!confirm.id) return;
    setUpdatingId(confirm.id);
    const status =
      confirm.action === "check-out" ? "checked out" : "checked in";
    updateMutation.mutate({ id: confirm.id, status });
  };

  const totalPages = Math.ceil(checkouts.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return checkouts.slice(start, start + ITEMS_PER_PAGE);
  }, [page, checkouts]);

  if (isError) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-serif text-[#F5DEB3]">Check-outs</h1>
        <p className="text-red-400">
          {(error as Error)?.message || "Failed to load today's check-outs"}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-serif text-[#F5DEB3]">Today's Check-outs</h1>

      {isLoading ? (
        <CheckOutTableSkeleton />
      ) : checkouts.length === 0 ? (
        <div className="rounded-xl border border-[#3A1A22] bg-linear-to-b from-[#241217] to-[#1F1216] p-6">
          <EmptyState
            title="No check-outs today"
            description="There are no guests scheduled to check-out today."
            icon={<CalendarX className="h-8 w-8 text-[#D4AF37]" />}
          />
        </div>
      ) : (
        <>
          <CheckOutTable
            checkouts={paginated}
            updatingId={updatingId}
            onCheckOut={(id) =>
              setConfirm({ open: true, id, action: "check-out" })
            }
            onNotCheckedOut={(id) =>
              setConfirm({ open: true, id, action: "not-checked-out" })
            }
          />

          <ConfirmModal
            open={confirm.open}
            title={
              confirm.action === "check-out"
                ? "Confirm check-out?"
                : "Confirm not checked-out?"
            }
            description={
              confirm.action === "check-out"
                ? "Mark this guest as checked out?"
                : "Confirm that this guest has not checked out. Booking will remain as checked in."
            }
            confirmText={
              updateMutation.isPending ? "Updating..." : "Yes, confirm"
            }
            cancelText="Cancel"
            onCancel={() =>
              setConfirm({ open: false, id: null, action: "check-out" })
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
