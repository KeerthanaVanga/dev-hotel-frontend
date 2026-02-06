// src/pages/OfferFormPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOffer, getOfferById, updateOffer } from "../api/offers.api";
import type { ApiRoom } from "../types/ApiRoom";
import { getRooms } from "../api/rooms.api";

function toDateOnly(iso?: string | null) {
  if (!iso) return "";
  return iso.split("T")[0] ?? iso;
}

const emptyForm = {
  roomId: "" as number | "",
  discount: "" as number | "",
  offerPrice: "",
  startDate: "",
  endDate: "",
  active: true,
  title: "",
};

export default function OfferFormPage() {
  const { offerId } = useParams();
  const numericOfferId = offerId ? Number(offerId) : null;
  const isEdit = !!numericOfferId;

  const navigate = useNavigate();
  const qc = useQueryClient();

  const [form, setForm] = useState(emptyForm);

  const roomsQ = useQuery({
    queryKey: ["rooms", "for-offers"],
    queryFn: getRooms,
    select: (r) => r.data,
  });

  const offerQ = useQuery({
    queryKey: ["offer", numericOfferId],
    queryFn: () => getOfferById(numericOfferId!),
    enabled: !!numericOfferId,
  });

  // Prefill on edit: defer setState so it's not synchronous in the effect (avoids cascading renders)
  useEffect(() => {
    if (!offerQ.data) return;
    let cancelled = false;
    const data = offerQ.data;
    queueMicrotask(() => {
      if (cancelled) return;
      setForm({
        roomId: data.room_id,
        discount: data.discount_percent,
        offerPrice: data.offer_price != null ? String(data.offer_price) : "",
        startDate: toDateOnly(data.start_date),
        endDate: toDateOnly(data.end_date),
        active: Boolean(data.is_active ?? true),
        title: data.title ?? "",
      });
    });
    return () => {
      cancelled = true;
    };
  }, [offerQ.data]);

  const selectedRoom: ApiRoom | undefined = useMemo(() => {
    return roomsQ.data?.find((r: ApiRoom) => r.room_id === form.roomId);
  }, [roomsQ.data, form.roomId]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!form.roomId || !form.discount)
        throw new Error("Room and discount are required");

      const payload = {
        title: form.title,
        room_id: Number(form.roomId),
        discount_percent: Number(form.discount),
        offer_price: form.offerPrice.trim() ? Number(form.offerPrice) : null,
        start_date: form.startDate ? form.startDate : null,
        end_date: form.endDate ? form.endDate : null,
        is_active: form.active,
      };

      if (isEdit && offerId) {
        return updateOffer(offerId, payload);
      }
      return createOffer(payload);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["offers"] });
      navigate("/offers");
    },
  });

  const loading = roomsQ.isLoading || (isEdit && offerQ.isLoading);

  if (loading) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-serif text-[#F5DEB3]">
          {isEdit ? "Update Offer" : "Create Offer"}
        </h1>
        <div className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-full animate-pulse rounded-md bg-white/5"
            />
          ))}
        </div>
      </section>
    );
  }

  if (roomsQ.isError || offerQ.isError) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-serif text-[#F5DEB3]">
          {isEdit ? "Update Offer" : "Create Offer"}
        </h1>
        <p className="text-red-400">Failed to load form data</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-serif text-[#F5DEB3]">
          {isEdit ? "Update Offer" : "Create Offer"}
        </h1>

        <button
          onClick={() => navigate("/offers")}
          className="rounded-lg border border-[#3A1A22] px-4 py-2 text-sm text-[#F5DEB3] hover:bg-white/5"
        >
          Back
        </button>
      </div>

      <div className="rounded-xl border border-[#3A1A22] bg-[#241217] p-5">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Title */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm text-[#F5DEB3]/70">Offer Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g. Standard Offer"
              className="w-full rounded-lg border border-[#3A1A22] bg-[#1F1216] px-3 py-2 text-sm text-[#F5DEB3] outline-none"
            />
          </div>
          {/* Room */}
          <div className="space-y-1">
            <label className="text-sm text-[#F5DEB3]/70">Room</label>
            <select
              value={form.roomId}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  roomId: e.target.value ? Number(e.target.value) : "",
                }))
              }
              className="w-full rounded-lg border border-[#3A1A22] bg-[#1F1216] px-3 py-2 text-sm text-[#F5DEB3] outline-none"
            >
              <option value="">Select room</option>
              {(roomsQ.data ?? []).map((r) => (
                <option key={r.room_id} value={r.room_id}>
                  {r.room_name ?? "Room"} — {r.room_type} (₹{r.price})
                </option>
              ))}
            </select>
          </div>

          {/* Discount */}
          <div className="space-y-1">
            <label className="text-sm text-[#F5DEB3]/70">Discount %</label>
            <input
              type="number"
              min={1}
              max={100}
              value={form.discount}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  discount: e.target.value ? Number(e.target.value) : "",
                }))
              }
              className="w-full rounded-lg border border-[#3A1A22] bg-[#1F1216] px-3 py-2 text-sm text-[#F5DEB3] outline-none"
              placeholder="e.g. 25"
            />
          </div>

          {/* Offer price */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm text-[#F5DEB3]/70">
              Offer price per night (₹, optional)
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={form.offerPrice}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, offerPrice: e.target.value }))
              }
              className="w-full rounded-lg border border-[#3A1A22] bg-[#1F1216] px-3 py-2 text-sm text-[#F5DEB3] outline-none"
              placeholder="e.g. 1500 (leave empty to use discount % only)"
            />
          </div>

          {/* Start */}
          <div className="space-y-1">
            <label className="text-sm text-[#F5DEB3]/70">
              Start date (optional)
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="w-full rounded-lg border border-[#3A1A22] bg-[#1F1216] px-3 py-2 text-sm text-[#F5DEB3] outline-none"
            />
          </div>

          {/* End */}
          <div className="space-y-1">
            <label className="text-sm text-[#F5DEB3]/70">
              End date (optional)
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="w-full rounded-lg border border-[#3A1A22] bg-[#1F1216] px-3 py-2 text-sm text-[#F5DEB3] outline-none"
            />
          </div>

          {/* Active */}
          <div className="md:col-span-2 flex items-center justify-between rounded-lg border border-[#3A1A22] bg-[#1F1216] px-3 py-3">
            <div>
              <p className="text-sm text-[#F5DEB3]">Active</p>
              <p className="text-xs text-[#F5DEB3]/60">
                Controls whether offer appears on UI
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({ ...prev, active: !prev.active }))
              }
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                form.active
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-red-500/15 text-red-400"
              }`}
            >
              {form.active ? "active" : "inactive"}
            </button>
          </div>

          {/* Preview */}
          <div className="md:col-span-2 rounded-lg border border-[#3A1A22] bg-linear-to-b from-[#241217] to-[#1F1216] p-4">
            <p className="text-sm text-[#F5DEB3]/70">Preview</p>
            <div className="mt-2 text-sm">
              <p className="text-[#F5DEB3]">
                Room:{" "}
                <span className="text-[#F5DEB3]/80">
                  {selectedRoom?.room_name ?? "-"}
                </span>
              </p>
              <p className="text-[#F5DEB3]">
                Original:{" "}
                <span className="text-[#F5DEB3]/80">
                  ₹{selectedRoom?.price ?? "-"}
                </span>
              </p>
              <p className="text-[#F5DEB3]">
                Discount:{" "}
                <span className="text-[#F5DEB3]/80">{form.discount || 0}%</span>
              </p>
              {form.offerPrice.trim() && (
                <p className="text-[#F5DEB3]">
                  Offer price:{" "}
                  <span className="text-[#D4AF37]">
                    ₹{form.offerPrice}/night
                  </span>
                </p>
              )}
              {!form.offerPrice.trim() && (
                <p className="text-[#F5DEB3]/70 text-xs mt-2">
                  Set offer price above, or leave empty to rely on discount %
                  only (if supported by your setup).
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={() => navigate("/offers")}
            className="rounded-lg border border-[#3A1A22] px-4 py-2 text-sm text-[#F5DEB3] hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-medium text-[#241217] hover:opacity-90 disabled:opacity-60"
          >
            {mutation.isPending
              ? "Saving..."
              : isEdit
                ? "Update Offer"
                : "Create Offer"}
          </button>
        </div>

        {mutation.isError && (
          <p className="mt-3 text-sm text-red-400">
            {(mutation.error as Error)?.message || "Failed to save offer"}
          </p>
        )}
      </div>
    </section>
  );
}
