type Props = {
  data: {
    totalRevenue: number;
    revenueToday: number;
    totalBookings: number;
    occupancy: number;
    adr: number;
    revpar: number;
  };
};

export default function KPICards({ data }: Props) {
  const stats = [
    { label: "Total Revenue", value: `₹${data.totalRevenue}` },
    { label: "Revenue Today", value: `₹${data.revenueToday}` },
    { label: "Bookings", value: data.totalBookings },
    { label: "Occupancy", value: `${data.occupancy}%` },
    { label: "ADR", value: `₹${data.adr}` },
    { label: "RevPAR", value: `₹${data.revpar}` },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4"
        >
          <p className="text-sm text-[#F5DEB3]/60">{s.label}</p>
          <p className="mt-2 text-2xl font-semibold text-[#D4AF37]">
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}
