export default function RoomFormSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
      <div className="h-8 w-40 rounded bg-[#3A1A22]" />

      <div className="rounded-xl border border-[#3A1A22] bg-[#241217] p-6 space-y-6">
        {/* Upload box */}
        <div className="h-48 rounded-xl bg-[#3A1A22]" />

        {/* Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded bg-[#3A1A22]" />
          ))}
        </div>

        <div className="h-24 rounded bg-[#3A1A22]" />
        <div className="h-10 rounded bg-[#3A1A22]" />

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <div className="h-10 w-24 rounded bg-[#3A1A22]" />
          <div className="h-10 w-32 rounded bg-[#3A1A22]" />
        </div>
      </div>
    </div>
  );
}
