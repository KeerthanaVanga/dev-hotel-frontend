export default function ChatWindowSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse p-6 space-y-4">
      <div className="h-4 w-1/3 bg-[#3A1A22] rounded" />
      <div className="flex-1 space-y-3">
        <div className="h-10 w-1/2 bg-[#3A1A22] rounded" />
        <div className="h-10 w-1/3 bg-[#3A1A22] rounded ml-auto" />
      </div>
      <div className="h-10 bg-[#3A1A22] rounded" />
    </div>
  );
}
