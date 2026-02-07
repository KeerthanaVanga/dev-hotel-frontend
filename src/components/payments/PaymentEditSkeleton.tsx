import Skeleton from "../ui/Skeleton";

export default function PaymentEditSkeleton() {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-xl border border-[#3A1A22] bg-[#241217] p-6 space-y-4">
        <Skeleton className="h-6 w-40" />

        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />

        <div className="flex justify-end gap-3 pt-4">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}
