// src/components/offers/OffersTableSkeleton.tsx
export default function OffersTableSkeleton() {
  return (
    <div className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4 space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-10 w-full animate-pulse rounded-md bg-white/5"
        />
      ))}
    </div>
  );
}
