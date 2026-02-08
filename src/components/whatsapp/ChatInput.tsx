import { Smile, Send } from "lucide-react";

export default function ChatInput() {
  return (
    <div className="border-t border-[#3A1A22] px-4 py-3 flex items-center gap-3 bg-[#1F1216]">
      <Smile size={18} className="text-[#F5DEB3]/60" />

      <input
        placeholder="Type a message"
        className="
          flex-1
          bg-[#241217]
          rounded-lg
          px-3 py-2
          text-sm
          outline-none
          text-[#F5DEB3]
        "
      />

      <Send size={18} className="text-[#D4AF37] cursor-pointer" />
    </div>
  );
}
