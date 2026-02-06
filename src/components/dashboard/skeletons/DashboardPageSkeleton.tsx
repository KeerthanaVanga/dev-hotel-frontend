import Skeleton from "../../ui/Skeleton";

export default function DashboardPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-56" />

      {/* KPI skeletons */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4"
          >
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-3 h-7 w-24" />
            <Skeleton className="mt-2 h-3 w-32" />
          </div>
        ))}
      </div>

      {/* charts skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-[#3A1A22] bg-[#241217] p-4">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="mt-4 h-64 w-full" />
        </div>

        <div className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="mt-4 h-64 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
