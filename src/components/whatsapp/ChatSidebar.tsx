import { Search } from "lucide-react";
import ChatUsersSkeleton from "./ChatUserSkeleton";
import type { ChatUser } from "../../types/Chat";

interface Props {
  loading: boolean;
  users: ChatUser[];
  selectedUser: ChatUser | null;
  onSelect: (u: ChatUser) => void;
}

export default function ChatSidebar({
  loading,
  users,
  selectedUser,
  onSelect,
}: Props) {
  if (loading) return <ChatUsersSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-80 border-r border-[#3A1A22] flex flex-col">
      {/* Search */}
      <div className="p-4 shrink-0 sticky top-0 z-20 bg-[#1F1216] border-b border-[#3A1A22]">
        <div className="flex items-center gap-2 bg-[#241217] px-3 py-2 rounded-lg">
          <Search size={16} className="text-[#F5DEB3]/50" />
          <input
            placeholder="Search"
            className="bg-transparent text-sm outline-none text-[#F5DEB3] w-full"
          />
        </div>
      </div>

      {/* USERS SCROLL */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
        {(users || []).map((u, index) => (
          <button
            key={`user-${index}`}
            onClick={() => onSelect(u)}
            className={`
                        w-full px-4 py-3 rounded-xl flex gap-3 items-center
                        border transition
                        ${
                          selectedUser?.phone === u.phone
                            ? "bg-[#2A161B] border-[#D4AF37]/60 ring-1 ring-[#D4AF37]/30"
                            : "border-transparent hover:border-[#3A1A22] hover:bg-[#241217]"
                        }
                      `}
          >
            <div className="h-10 w-10 rounded-full bg-[#3A1A22] flex items-center justify-center text-[#D4AF37] font-semibold">
              {u.name[0]}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{u.name}</div>
              <div className="text-xs text-[#F5DEB3]/50 truncate">
                {u.lastMessage}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
