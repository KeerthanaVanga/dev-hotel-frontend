import type { Payment } from "../../types/Payment";
import { Pencil } from "lucide-react";

export default function PaymentsTable({
  payments,
  onEdit,
}: {
  payments: Payment[];
  onEdit: (p: Payment) => void;
}) {
  return (
    <>
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block rounded-xl border border-[#3A1A22] bg-[#241217] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[#3A1A22] text-[#F5DEB3]/60">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3">Booking</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Nights</th>
              <th className="px-4 py-3">Per Night</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Paid</th>
              <th className="px-4 py-3">Remaining to pay</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#3A1A22]">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-left">{p.userName}</td>
                <td className="px-4 py-3 text-center">{p.bookingDate}</td>
                <td className="px-4 py-3 text-center">{p.paymentDate}</td>
                <td className="px-4 py-3 text-center">{p.roomType}</td>
                <td className="px-4 py-3 text-center">{p.nights}</td>
                <td className="px-4 py-3 text-center">₹{p.perNightPrice}</td>
                <td className="px-4 py-3 text-center">₹{p.billGenerated}</td>
                <td className="px-4 py-3 text-center">₹{p.billPaid}</td>
                <td className="px-4 py-3 text-center">₹{p.remainingToPay}</td>
                <td className="px-4 py-3 text-center">{p.paymentMethod}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onEdit(p)}
                    className="inline-flex items-center gap-1 text-[#D4AF37] hover:text-[#F5DEB3]"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="space-y-4 md:hidden">
        {payments.map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4 space-y-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-[#F5DEB3]">{p.userName}</p>
                <p className="text-xs text-[#F5DEB3]/60">{p.roomType}</p>
              </div>

              <span className={`rounded-full px-2 py-0.5 text-xs font-medium`}>
                {p.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-[#F5DEB3]/70">
              <p>Booking: {p.bookingDate}</p>
              <p>Payment: {p.paymentDate}</p>
              <p>Nights: {p.nights}</p>
              <p>Per night: ₹{p.perNightPrice}</p>
              <p>Total: ₹{p.billGenerated}</p>
              <p>Paid: ₹{p.billPaid}</p>
              <p>Remaining: ₹{p.remainingToPay}</p>
              <p>Method: {p.paymentMethod}</p>
            </div>

            <button
              onClick={() => onEdit(p)}
              className="mt-2 w-full rounded-md border border-[#3A1A22] py-2 text-sm text-[#D4AF37] hover:border-[#D4AF37]"
            >
              Edit Payment
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
