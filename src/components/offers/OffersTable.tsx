// src/components/offers/OffersTable.tsx
import type { OfferRow } from "../../types/OfferRow";

export default function OffersTable({
  offers,
  onEdit,
  onDelete,
}: {
  offers: OfferRow[];
  onEdit: (id: string) => void;
  onDelete: (id: string, label: string) => void;
}) {
  return (
    <>
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block rounded-xl border border-[#3A1A22] bg-[#241217] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[#3A1A22] text-[#F5DEB3]/60">
            <tr>
              <th className="px-4 py-3 text-left">Room</th>
              <th className="px-4 py-3 text-center">Title</th>
              <th className="px-4 py-3 text-center">Original</th>
              <th className="px-4 py-3 text-center">Discount</th>
              <th className="px-4 py-3 text-center">Offer Price</th>
              <th className="px-4 py-3 text-center">Active</th>
              <th className="px-4 py-3 text-center">Start</th>
              <th className="px-4 py-3 text-center">End</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#3A1A22]">
            {offers.map((o) => {
              const label = `${o.roomName}`;
              return (
                <tr key={o.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#F5DEB3]">
                      {o.roomName}
                    </div>
                    <div className="text-xs text-[#F5DEB3]/60">
                      {o.roomType}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">{o.title}</td>
                  <td className="px-4 py-3 text-center">₹{o.originalPrice}</td>
                  <td className="px-4 py-3 text-center">
                    {o.discountPercent}%
                  </td>
                  <td className="px-4 py-3 text-center">₹{o.offerPrice}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        o.active
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {o.active ? "active" : "inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{o.startDate}</td>
                  <td className="px-4 py-3 text-center">{o.endDate}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button
                      onClick={() => onEdit(o.id)}
                      className="text-sm text-[#D4AF37] hover:opacity-90"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => onDelete(o.id, label)}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="space-y-4 md:hidden">
        {offers.map((o) => {
          const label = `${o.roomName}`;
          return (
            <div
              key={o.id}
              className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4 space-y-2"
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-medium text-[#F5DEB3]">{o.roomName}</p>
                  <p className="text-sm text-[#F5DEB3]/70">{o.roomType}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    o.active
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {o.active ? "active" : "inactive"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>Original: ₹{o.originalPrice}</p>
                <p>Discount: {o.discountPercent}%</p>
                <p>Offer: ₹{o.offerPrice}</p>
                <p>Start: {o.startDate}</p>
                <p className="col-span-2">End: {o.endDate}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => onEdit(o.id)}
                  className="w-full rounded-md border border-[#3A1A22] py-2 text-sm text-[#D4AF37] hover:border-[#D4AF37]"
                >
                  Update
                </button>
                <button
                  onClick={() => onDelete(o.id, label)}
                  className="w-full rounded-md border border-[#3A1A22] py-2 text-sm text-red-400 hover:border-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
