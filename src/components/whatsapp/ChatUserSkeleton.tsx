export default function ChatUsersSkeleton() {
  return (
    <aside className="h-full w-20 lg:w-80 border-r border-[#3A1A22] flex flex-col">
      {/* Search Skeleton */}
      <div className="p-4 shrink-0 border-b border-[#3A1A22]">
        <div className="h-9 rounded-lg bg-[#3A1A22] animate-pulse" />
      </div>

      {/* Users Skeleton */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-3 items-center px-4 py-3 rounded-xl border border-transparent animate-pulse"
          >
            <div className="h-10 w-10 rounded-full bg-[#3A1A22]" />

            <div className="hidden lg:block flex-1 space-y-2">
              <div className="h-3 bg-[#3A1A22] rounded w-1/2" />
              <div className="h-2 bg-[#3A1A22] rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
