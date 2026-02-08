import { useEffect, useRef } from "react";
import type { ChatUser } from "../../types/Chat";
import type { Message } from "../../types/Chat";
import ChatWindowSkeleton from "./ChatWindowSkeleton";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatWindow({
  user,
  messages,
  loading,
}: {
  user: ChatUser;
  messages: Message[];
  loading: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-[#1B0F12]">
      {/* HEADER (STICKY) */}
      <div className="shrink-0 px-6 py-4 border-b border-[#3A1A22] bg-[#1F1216] flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-[#3A1A22] flex items-center justify-center text-[#D4AF37] font-semibold">
          {user.name[0]}
        </div>
        <span className="font-medium text-[#F5DEB3]">{user.name}</span>
      </div>

      {/* MESSAGES (ONLY THIS SCROLLS) */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {loading ? (
          <ChatWindowSkeleton />
        ) : (
          messages.map((m) => <ChatMessage key={m.id} message={m} />)
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT (STICKY BOTTOM) */}
      <div className="shrink-0 border-t border-[#3A1A22] bg-[#1F1216]">
        <ChatInput />
      </div>
    </div>
  );
}
