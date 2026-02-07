import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";

import type { Payment } from "../types/Payment";
import PaymentsTable from "../components/payments/PaymentsTable";
import PaymentEditModal from "../components/payments/PaymentEditModal";
import PaymentsTableSkeleton from "../components/payments/PaymentTableSkeleton";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import { useToast } from "../context/ToastContext";

import { getPayments, updatePayment } from "../api/payments.api";
import type { UpdatePaymentPayload } from "../api/payments.api";

const ITEMS_PER_PAGE = 5;

function daysBetween(fromISO: string, toISO: string) {
  const from = new Date(fromISO);
  const to = new Date(toISO);
  const diffMs = to.getTime() - from.getTime();
  return Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

function dateOnly(iso?: string) {
  return iso ? iso.split("T")[0] : "—";
}

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Payment | null>(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const {
    data: payments = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["payments"],
    queryFn: getPayments,
    select: (response): Payment[] =>
      response.data.map((p) => {
        const nights = daysBetween(p.bookings.check_in, p.bookings.check_out);

        const billGenerated = Number(p.bill_amount);
        const billPaid = Number(p.bill_paid_amount);
        const perNight = Math.round(billGenerated / nights);

        return {
          id: p.payment_id,
          userName: p.users.name,
          bookingDate: dateOnly(p.bookings.check_in),
          paymentDate: billPaid > 0 ? dateOnly(p.created_at) : "—",
          roomType: `Booking #${p.booking_id}`,
          nights,
          perNightPrice: perNight,
          billGenerated,
          billPaid,
          remainingToPay: Math.max(0, billGenerated - billPaid),
          paymentMethod: p.method,
          status: p.status,
        };
      }),
  });

  const updatePaymentMutation = useMutation({
    mutationFn: ({
      paymentId,
      payload,
    }: {
      paymentId: string;
      payload: UpdatePaymentPayload;
    }) => updatePayment(paymentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      setSelected(null);
      showToast("success", "Saved");
    },
  });

  /* ---------- Pagination ---------- */
  const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE);

  const paginatedPayments = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return payments.slice(start, start + ITEMS_PER_PAGE);
  }, [page, payments]);

  /* ---------- Error ---------- */
  if (isError) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-serif text-[#F5DEB3]">Payments</h1>
        <p className="text-red-400">
          {(error as Error)?.message || "Failed to load payments"}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-serif text-[#F5DEB3]">Payments</h1>

      {isLoading ? (
        <PaymentsTableSkeleton />
      ) : payments.length === 0 ? (
        <div className="rounded-xl border border-[#3A1A22] bg-linear-to-b from-[#241217] to-[#1F1216] p-6">
          <EmptyState
            title="No payments found"
            description="Payments will appear here once bookings start receiving payments."
            icon={<CreditCard className="h-8 w-8 text-[#D4AF37]" />}
          />
        </div>
      ) : (
        <>
          <PaymentsTable
            payments={paginatedPayments}
            onEdit={(payment) => setSelected(payment)}
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

      {selected && (
        <PaymentEditModal
          payment={selected}
          isSaving={updatePaymentMutation.isPending}
          onClose={() => setSelected(null)}
          onSave={(payload) => {
            updatePaymentMutation.mutate({
              paymentId: selected.id,
              payload,
            });
          }}
        />
      )}
    </section>
  );
}
