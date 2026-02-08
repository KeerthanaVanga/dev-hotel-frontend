import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueTrendChart({
  data,
}: {
  data: { date: string; revenue: number }[];
}) {
  return (
    <div className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4">
      <h3 className="mb-4 font-serif text-[#F5DEB3]">Revenue Trend</h3>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <XAxis dataKey="date" stroke="#F5DEB3" />
          <YAxis stroke="#F5DEB3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#D4AF37"
            fill="#D4AF37"
            fillOpacity={0.25}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
