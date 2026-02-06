// src/pages/OffersPage.tsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Percent } from "lucide-react";

import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import OffersTable from "../components/offers/OffersTable";
import OffersTableSkeleton from "../components/offers/OffersTableSkeleton";
import ConfirmModal from "../components/ui/ConfirmModel";

import { deleteOffer, getOffers } from "../api/offers.api";
import type { OfferRow } from "../types/OfferRow";

const ITEMS_PER_PAGE = 6;

function toDateOnly(iso?: string | null) {
  if (!iso) return "-";
  return iso.split("T")[0] ?? iso;
}

export default function OffersPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<{
    open: boolean;
    offerId?: number;
    label?: string;
  }>({
    open: false,
  });

  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["offers"],
    queryFn: getOffers,
    select: (res): OfferRow[] =>
      res.map((o) => ({
        id: String(o.offer_id),
        roomName: o.rooms?.room_name ?? "-",
        roomType: o.rooms?.room_type ?? "-",
        title: o.title,
        originalPrice: o.rooms?.price ?? "-",
        discountPercent: o.discount_percent ?? 0,
        offerPrice: o.offer_price ?? "-",
        active: Boolean(o.is_active ?? true),
        startDate: toDateOnly(o.start_date),
        endDate: toDateOnly(o.end_date),
      })),
  });

  useEffect(() => setPage(1), [data.length]);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  }, [data, page]);

  const delMutation = useMutation({
    mutationFn: (offerId: number) => deleteOffer(offerId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["offers"] });
      setConfirm({ open: false });
    },
    onError: () => {
      setConfirm({ open: false });
    },
  });

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-serif text-[#F5DEB3]">Offers</h1>
          <button
            className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-medium text-[#241217] hover:opacity-90"
            onClick={() => navigate("/offers/new")}
          >
            Create Offer
          </button>
        </div>
        <OffersTableSkeleton />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-serif text-[#F5DEB3]">Offers</h1>
          <button
            className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-medium text-[#241217] hover:opacity-90"
            onClick={() => navigate("/offers/new")}
          >
            Create Offer
          </button>
        </div>
        <p className="text-red-400">
          {(error as Error)?.message || "Failed to load offers"}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-serif text-[#F5DEB3]">Offers</h1>

        <button
          className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-medium text-[#241217] hover:opacity-90"
          onClick={() => navigate("/offers/new")}
        >
          Create Offer
        </button>
      </div>

      {data.length === 0 ? (
        <div className="rounded-xl border border-[#3A1A22] bg-linear-to-b from-[#241217] to-[#1F1216] p-6">
          <EmptyState
            title="No offers yet"
            description="Create an offer to start showing discounted prices."
            icon={<Percent className="h-8 w-8 text-[#D4AF37]" />}
          />
        </div>
      ) : (
        <>
          <OffersTable
            offers={paginated}
            onEdit={(id) => navigate(`/offers/${id}/edit`)}
            onDelete={(id, label) =>
              setConfirm({ open: true, offerId: Number(id), label })
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

      <ConfirmModal
        open={confirm.open}
        title="Delete Offer?"
        description={
          confirm.label
            ? `This will permanently delete the offer for ${confirm.label}.`
            : "This will permanently delete the offer."
        }
        confirmText={delMutation.isPending ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        destructive
        onCancel={() => setConfirm({ open: false })}
        onConfirm={() => confirm.offerId && delMutation.mutate(confirm.offerId)}
      />
    </section>
  );
}
