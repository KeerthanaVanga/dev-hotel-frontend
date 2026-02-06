import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "../api/dashboard.api";
import DashboardPageSkeleton from "../components/dashboard/skeletons/DashboardPageSkeleton";
import KPICards from "../components/dashboard/KPICards";
import TodayBookingsChart from "../components/dashboard/TodayBookingsChart";
import BookingStatusPieChart from "../components/dashboard/BookingStatusPieChart";

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
  });

  if (isLoading) return <DashboardPageSkeleton />;

  if (isError || !data)
    return <p className="text-red-400">Failed to load dashboard data</p>;

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-serif text-[#F5DEB3]">Dashboard</h1>

      <KPICards data={data.kpis} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodayBookingsChart data={data.charts.hourlyBookings} />
        </div>

        <BookingStatusPieChart data={data.charts.bookingStatus} />
      </div>
    </section>
  );
}
