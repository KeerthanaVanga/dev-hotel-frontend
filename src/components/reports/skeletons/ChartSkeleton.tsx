import Skeleton from "../../ui/SkeletonReuse";

export default function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4">
      <Skeleton className="mb-4 h-5 w-40" />

      <div style={{ height }} className="flex items-end gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full rounded-md"
            style={{
              height: `${30 + Math.random() * 70}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
