import type { Review } from "../../types/Review";
import { Star } from "lucide-react";

export default function ReviewsTable({ reviews }: { reviews: Review[] }) {
  return (
    <>
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block rounded-xl border border-[#3A1A22] bg-[#241217] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[#3A1A22] text-[#F5DEB3]/60">
            <tr>
              <th className="px-4 py-3 text-left">Guest</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#3A1A22]">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-white/5">
                <td className="px-4 py-3">{r.userName}</td>
                <td className="px-4 py-3 text-center">{r.roomType}</td>
                <td className="px-4 py-3 text-center">
                  <Stars value={r.rating} />
                </td>
                <td className="px-4 py-3 text-[#F5DEB3]/80">{r.comment}</td>
                <td className="px-4 py-3 text-center">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="space-y-4 md:hidden">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4 space-y-2"
          >
            <div className="flex justify-between">
              <p className="font-medium text-[#F5DEB3]">{r.userName}</p>
              <Stars value={r.rating} />
            </div>

            <p className="text-sm text-[#F5DEB3]/70">{r.roomType}</p>

            <p className="text-sm text-[#F5DEB3]/80">{r.comment}</p>

            <p className="text-xs text-[#F5DEB3]/50">{r.date}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex justify-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < value ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#F5DEB3]/30"
          }
        />
      ))}
    </div>
  );
}
