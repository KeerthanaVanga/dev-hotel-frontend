export default function RoomsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-7 w-40 rounded bg-[#3A1A22] animate-pulse" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4 animate-pulse"
          >
            <div className="h-48 w-full rounded-lg bg-[#3A1A22]" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-32 rounded bg-[#3A1A22]" />
              <div className="h-3 w-24 rounded bg-[#3A1A22]" />
              <div className="h-4 w-20 rounded bg-[#3A1A22]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
