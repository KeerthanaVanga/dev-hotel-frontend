import Skeleton from "../ui/Skeleton";

export default function PaymentsTableSkeleton() {
  return (
    <div className="rounded-xl border border-[#3A1A22] bg-[#241217] overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-[#3A1A22]">
          <tr>
            {Array.from({ length: 11 }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <Skeleton className="h-4 w-16" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-[#3A1A22]">
          {Array.from({ length: 5 }).map((_, row) => (
            <tr key={row}>
              {Array.from({ length: 11 }).map((_, col) => (
                <td key={col} className="px-4 py-4">
                  <Skeleton className="h-4 w-full max-w-30" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
