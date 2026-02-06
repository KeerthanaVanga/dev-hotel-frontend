import type { BookingRow } from "../../types/BookingRow";

const STATUS_STYLE: Record<string, string> = {
  confirmed: "bg-emerald-500/15 text-emerald-400",
  "checked-in": "bg-emerald-500/15 text-emerald-400",
  upcoming: "bg-indigo-500/15 text-indigo-400",
  pending: "bg-yellow-500/15 text-yellow-300",
  cancelled: "bg-red-500/15 text-red-400",
};

export default function BookingsTable({
  bookings,
  onCancel,
  onReschedule,
}: {
  bookings: BookingRow[];
  onCancel: (id: string) => void;
  onReschedule: (booking: BookingRow) => void;
}) {
  return (
    <>
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block rounded-xl border border-[#3A1A22] bg-[#241217] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[#3A1A22] text-[#F5DEB3]/60">
            <tr>
              <th className="px-4 py-3 text-left">Guest</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Booking</th>
              <th className="px-4 py-3">Guests</th>
              <th className="px-4 py-3">Nights</th>
              <th className="px-4 py-3">From → To</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#3A1A22]">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-white/5">
                <td className="px-4 py-3">{b.guestName}</td>
                <td className="px-4 py-3 text-center">{b.roomName}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      STATUS_STYLE[b.status] || "bg-white/10 text-white/70"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">{b.bookingDate}</td>
                <td className="px-4 py-3 text-center">
                  {b.adults}A / {b.children}C
                </td>
                <td className="px-4 py-3 text-center">{b.nights}</td>
                <td className="px-4 py-3 text-center">
                  {b.fromDate} → {b.toDate}
                </td>
                <td className="px-4 py-3 text-right">
                  {b.status !== "cancelled" && (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onReschedule(b)}
                        className="text-sm text-[#D4AF37] hover:text-[#D4AF37]/80"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => onCancel(b.id)}
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="space-y-4 md:hidden">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4 space-y-2"
          >
            <div className="flex justify-between">
              <p className="font-medium text-[#F5DEB3]">{b.guestName}</p>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  STATUS_STYLE[b.status] || "bg-white/10 text-white/70"
                }`}
              >
                {b.status}
              </span>
            </div>

            <p className="text-sm text-[#F5DEB3]/70">{b.roomType}</p>
            <p className="text-sm">
              Guests: {b.adults}A / {b.children}C
            </p>
            <p className="text-sm">Nights: {b.nights}</p>
            <p className="text-sm">
              {b.fromDate} → {b.toDate}
            </p>

            {b.status !== "cancelled" && (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => onReschedule(b)}
                  className="flex-1 rounded-md border border-[#D4AF37] py-2 text-sm text-[#D4AF37] hover:bg-[#D4AF37]/10"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => onCancel(b.id)}
                  className="flex-1 rounded-md border border-[#3A1A22] py-2 text-sm text-red-400 hover:border-red-400"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
