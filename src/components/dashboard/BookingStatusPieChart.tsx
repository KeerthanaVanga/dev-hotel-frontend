import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { BookingStatusItem } from "../../types/Dashboard";

const COLORS: Record<string, string> = {
  confirmed: "#22c55e",
  rescheduled: "#facc15",
  cancelled: "#ef4444",
};

export default function BookingStatusPieChart({
  data,
}: {
  data: BookingStatusItem[];
}) {
  const isEmpty = !data || data.length === 0;

  const chartData = isEmpty ? [{ status: "no bookings", count: 1 }] : data;

  return (
    <div className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4">
      <h3 className="mb-4 font-serif text-[#F5DEB3]">
        Bookings Status (Today)
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            innerRadius={60}
            outerRadius={90}
            dataKey="count"
            nameKey="status"
          >
            {chartData.map((d, i) => (
              <Cell key={i} fill={COLORS[d.status] || "#888"} />
            ))}
          </Pie>

          {!isEmpty && (
            <Tooltip
              formatter={(value: any, _name, props: any) => {
                const status = props?.payload?.status ?? "";
                return [`${value}`, status];
              }}
            />
          )}

          {isEmpty && (
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#F5DEB3"
              fontSize={13}
            >
              No bookings today
            </text>
          )}
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#F5DEB3]/70">
        {chartData.map((s) => (
          <div key={s.status} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: COLORS[s.status] || "#888" }}
            />
            <span className="capitalize">{s.status}</span>
            {!isEmpty && (
              <>
                <span className="text-[#F5DEB3]/50">•</span>
                <span>{s.count}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
