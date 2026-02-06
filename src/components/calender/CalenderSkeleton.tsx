import Skeleton from "../ui/Skeleton";

export default function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-40" />

      <div className="grid grid-cols-7 gap-px rounded-xl overflow-hidden border border-[#3A1A22] bg-[#241217]">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-30 p-2 border border-[#3A1A22]">
            <Skeleton className="h-3 w-6 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
