import { useQuery } from "@tanstack/react-query";
import { getReportsSummary } from "../api/reports.api";
import ReportsPageSkeleton from "../components/reports/skeletons/ReportsPageSkeleton";
import KPICards from "../components/reports/KPICards";
import RevenueTrendChart from "../components/reports/RevenueTrendChart";
import RevenueByRoomChart from "../components/reports/RevenueByRoomChart";
import PaymentStatusChart from "../components/reports/PaymentStatusChart";

export default function ReportsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["reports"],
    queryFn: () => getReportsSummary(),
  });

  if (isLoading) return <ReportsPageSkeleton />;

  if (isError || !data)
    return <p className="text-red-400">Failed to load reports</p>;

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-serif text-[#F5DEB3]">Reports & Revenue</h1>

      <KPICards data={data.kpis} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueTrendChart data={data.charts.revenueTrend} />
        </div>

        <PaymentStatusChart data={data.charts.paymentStatus} />
      </div>

      <RevenueByRoomChart data={data.charts.revenueByRoom} />
    </section>
  );
}
