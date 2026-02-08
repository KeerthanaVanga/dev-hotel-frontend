import KPICardsSkeleton from "./KPICardSkeleton";
import ChartSkeleton from "./ChartSkeleton";

export default function ReportsPageSkeleton() {
  return (
    <section className="space-y-6">
      {/* Page title */}
      <div>
        <div className="h-6 w-48 animate-pulse rounded bg-[#3A1A22]" />
      </div>

      {/* KPI cards */}
      <KPICardsSkeleton />

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartSkeleton height={300} />
        </div>

        {/* Donut skeleton */}
        <div className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4 flex items-center justify-center">
          <div className="h-40 w-40 animate-pulse rounded-full border-8 border-[#3A1A22]" />
        </div>
      </div>

      {/* Bar chart */}
      <ChartSkeleton height={260} />
    </section>
  );
}
