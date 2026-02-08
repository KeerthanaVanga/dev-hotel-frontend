import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueByRoomChart({
  data,
}: {
  data: { room_name: string; revenue: number }[];
}) {
  return (
    <div className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4">
      <h3 className="mb-4 font-serif text-[#F5DEB3]">Revenue by Room Type</h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey="room_name" stroke="#F5DEB3" />
          <YAxis stroke="#F5DEB3" />
          <Tooltip />
          <Bar dataKey="revenue" fill="#D4AF37" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
