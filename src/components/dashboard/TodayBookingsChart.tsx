import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { HourlyBookingPoint } from "../../types/Dashboard";

export default function TodayBookingsChart({
  data,
}: {
  data: HourlyBookingPoint[];
}) {
  const safe = data?.length ? data : [{ hour: "—", count: 0 }];

  return (
    <div className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4">
      <h3 className="mb-4 font-serif text-[#F5DEB3]">
        Today Bookings (Hourly)
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={safe}>
          <XAxis dataKey="hour" tick={{ fill: "#F5DEB3" }} />
          <YAxis tick={{ fill: "#F5DEB3" }} />
          <Tooltip />
          <Bar dataKey="count" fill="#D4AF37" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
