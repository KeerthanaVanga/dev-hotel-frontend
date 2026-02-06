type Props = {
  data: {
    totalUsers: number;
    newUsersToday: number;
    todayBookings: number;
    todayCheckIn: number;
    todayCheckOut: number;
    upcomingBookings: number;
    todayRevenue: number;
  };
};

const Card = ({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) => (
  <div className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4">
    <p className="text-sm text-[#F5DEB3]/60">{title}</p>
    <p className="mt-2 text-2xl font-semibold text-[#F5DEB3]">{value}</p>
    {subtitle ? (
      <p className="mt-1 text-xs text-[#F5DEB3]/50">{subtitle}</p>
    ) : null}
  </div>
);

export default function KPICards({ data }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card title="Total Users" value={data.totalUsers} />
      <Card title="New Users (Today)" value={data.newUsersToday} />
      <Card title="Bookings (Today)" value={data.todayBookings} />
      <Card title="Upcoming Bookings" value={data.upcomingBookings} />
      <Card title="Check-ins (Today)" value={data.todayCheckIn} />
      <Card title="Check-outs (Today)" value={data.todayCheckOut} />
      <Card title="Revenue (Today)" value={`₹${data.todayRevenue}`} />
    </div>
  );
}
