import Skeleton from "../ui/Skeleton";

export default function RescheduleBookingSkeleton() {
  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <h1 className="text-2xl font-serif text-[#F5DEB3]">Reschedule booking</h1>

      {/* Step indicator skeleton – 3 steps with chevrons */}
      <div className="flex items-center justify-between gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-1 items-center">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-[#3A1A22] bg-[#241217]/50 px-3 py-2">
              <Skeleton className="h-4 w-4 shrink-0 rounded" />
              <Skeleton className="h-3 w-20 md:w-24" />
            </div>
            {i < 3 && <Skeleton className="mx-1 h-4 w-4 shrink-0 rounded" />}
          </div>
        ))}
      </div>

      {/* Form card skeleton – room + dates grid + actions */}
      <div className="rounded-xl border border-[#3A1A22] bg-gradient-to-b from-[#241217] to-[#1F1216] p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4">
            {/* Room select row */}
            <div className="min-w-0 [grid-column:1/-1] space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            {/* Check-in */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            {/* Check-out */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          {/* Action bar */}
          <div className="flex justify-between gap-3 border-t border-[#3A1A22] pt-4">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </section>
  );
}
