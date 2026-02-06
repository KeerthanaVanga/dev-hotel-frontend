import Skeleton from "../ui/Skeleton";

export default function BookingsTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Desktop */}
      <div className="hidden md:block rounded-xl border border-[#3A1A22] bg-[#241217]">
        <table className="w-full">
          <thead>
            <tr>
              {Array.from({ length: 8 }).map((_, i) => (
                <th key={i} className="px-4 py-4">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, r) => (
              <tr key={r}>
                {Array.from({ length: 8 }).map((_, c) => (
                  <td key={c} className="px-4 py-4">
                    <Skeleton className="h-4 w-full max-w-35" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4 space-y-3"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
