import Skeleton from "../../ui/SkeletonReuse";

export default function KPICardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4"
        >
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-3 h-8 w-32" />
        </div>
      ))}
    </div>
  );
}
