import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import ChatSidebar from "../components/whatsapp/ChatSidebar";
import EmptyChat from "../components/whatsapp/EmptyChat";
import ChatWindow from "../components/whatsapp/ChatWindow";

import type { ChatUser } from "../types/Chat";
import { fetchWhatsAppUsers, fetchWhatsAppMessages } from "../api/whatsapp.api";

export default function WhatsAppPage() {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  /* ---------- USERS ---------- */
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["whatsapp-users"],
    queryFn: fetchWhatsAppUsers,
  });

  /* ---------- MESSAGES ---------- */
  const phone = selectedUser?.phone ?? "";

  const {
    data: messages = [],
    isLoading: loadingMessages,
    isFetching,
  } = useQuery({
    queryKey: ["whatsapp-messages", phone],
    enabled: !!phone,
    queryFn: () => fetchWhatsAppMessages(phone),
  });

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-7xl h-[calc(100vh-6rem)] bg-[#1F1216] rounded-2xl overflow-hidden border border-[#3A1A22] flex">
        <ChatSidebar
          loading={loadingUsers}
          users={users}
          selectedUser={selectedUser}
          onSelect={setSelectedUser}
        />

        {!selectedUser ? (
          <EmptyChat />
        ) : (
          <ChatWindow
            user={selectedUser}
            messages={messages}
            loading={loadingMessages || isFetching}
          />
        )}
      </div>
    </div>
  );
}
