import { MessageCircle } from "lucide-react";

export default function EmptyChat() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full flex-1 text-center text-[#F5DEB3]/60">
      <MessageCircle size={48} className="mb-4 opacity-30" />
      <h3 className="text-lg font-medium">WhatsApp for Hotel</h3>
      <p className="text-sm max-w-xs">
        Select a chat to start messaging guests.
      </p>
    </div>
  );
}
