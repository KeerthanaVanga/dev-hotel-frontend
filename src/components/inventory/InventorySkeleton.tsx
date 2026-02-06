import Skeleton from "../ui/Skeleton";

export default function InventorySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col md:flex-row gap-4 rounded-xl border border-[#3A1A22] bg-[#241217] p-4"
        >
          <Skeleton className="h-40 w-full md:w-56 rounded-lg" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
