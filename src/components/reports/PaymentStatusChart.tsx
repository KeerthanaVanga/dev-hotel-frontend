import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type PaymentStatusItem = {
  status: string;
  count: number;
  totalBillAmount: number;
  paidAmount: number;
  pendingAmount: number;
};

const COLORS: Record<string, string> = {
  paid: "#22c55e",
  pending: "#facc15",
  partial: "#f97316",
  success: "#22c55e", // if your DB still uses "success"
};

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export default function PaymentStatusChart({
  data,
}: {
  data: PaymentStatusItem[];
}) {
  // ✅ chart should represent MONEY, so we use pendingAmount for pending/partial, and paidAmount for paid
  const chartData = data.map((d) => {
    const normalizedStatus =
      d.status.toLowerCase() === "success" ? "paid" : d.status.toLowerCase();

    const value = normalizedStatus === "paid" ? d.paidAmount : d.pendingAmount; // pending + partial show outstanding money

    return {
      ...d,
      status: normalizedStatus,
      value,
    };
  });

  const totalPaid = data.reduce((sum, d) => sum + (d.paidAmount || 0), 0);
  const totalPending = data.reduce((sum, d) => sum + (d.pendingAmount || 0), 0);

  return (
    <div className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4">
      <h3 className="mb-4 font-serif text-[#F5DEB3]">Payment Status</h3>

      <div className="relative">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={70}
              outerRadius={95}
              dataKey="value" // ✅ money not count
              nameKey="status"
            >
              {chartData.map((d, i) => (
                <Cell key={i} fill={COLORS[d.status] || "#888"} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, _name, props) => {
                const amount = typeof value === "number" ? value : 0;
                const payload = props?.payload as any;

                return [
                  formatINR(amount),
                  `${payload.status.toUpperCase()} (${payload.count})`,
                ];
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* ✅ Center label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-xs text-[#F5DEB3]/60">Paid</p>
          <p className="text-lg font-semibold text-[#F5DEB3]">
            {formatINR(totalPaid)}
          </p>

          <p className="mt-2 text-xs text-[#F5DEB3]/60">Pending</p>
          <p className="text-sm font-semibold text-[#F5DEB3]/90">
            {formatINR(totalPending)}
          </p>
        </div>
      </div>

      {/* ✅ Legend */}
      <div className="mt-4 space-y-2 text-sm">
        {data.map((d) => {
          const status =
            d.status.toLowerCase() === "success"
              ? "paid"
              : d.status.toLowerCase();
          return (
            <div key={d.status} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[status] || "#888" }}
                />
                <span className="text-[#F5DEB3]/80 capitalize">
                  {status} ({d.count})
                </span>
              </div>
              <span className="text-[#F5DEB3] font-medium">
                {status === "paid"
                  ? formatINR(d.paidAmount)
                  : formatINR(d.pendingAmount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
