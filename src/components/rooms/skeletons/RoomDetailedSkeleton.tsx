export default function RoomDetailsSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Gallery */}
      <div className="space-y-4 animate-pulse">
        <div className="h-105 rounded-xl bg-[#3A1A22]" />
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 w-24 rounded-lg bg-[#3A1A22]" />
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-56 rounded bg-[#3A1A22]" />
          <div className="h-4 w-32 rounded bg-[#3A1A22]" />
        </div>

        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-[#3A1A22]" />
          <div className="h-4 w-5/6 rounded bg-[#3A1A22]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="h-4 w-32 rounded bg-[#3A1A22]" />
          <div className="h-4 w-32 rounded bg-[#3A1A22]" />
        </div>

        <div className="space-y-2">
          <div className="h-5 w-32 rounded bg-[#3A1A22]" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 w-40 rounded bg-[#3A1A22]" />
            ))}
          </div>
        </div>

        <div className="h-24 rounded-lg bg-[#3A1A22]" />
      </div>
    </div>
  );
}
