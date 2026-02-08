import api from "../lib/axios-interceptor";
import type { ChatUser, Message } from "../types/Chat";

/* ================= TYPES ================= */

type ApiMessage = {
  id: number | string;
  message: string;
  sender_type: "ai" | "user";
  created_at: string; // ISO string (already IST)
};

/* ================= TIME FORMATTER ================= */

function formatChatTime(iso: string): string {
  // Example input: "2026-01-25T18:00:00"
  const [datePart, timePart] = iso.split("T");

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const date = new Date(year, month - 1, day, hour, minute);

  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/* ================= API FUNCTIONS ================= */

export async function fetchWhatsAppUsers(): Promise<ChatUser[]> {
  try {
    const res = await api.get("/whatsapp/users");
    return res.data.data as ChatUser[];
  } catch (error) {
    console.error("❌ Failed to fetch WhatsApp users:", error);
    throw error; // let TanStack Query handle retries / error states
  }
}

export async function fetchWhatsAppMessages(phone: string): Promise<Message[]> {
  try {
    const res = await api.get(`/whatsapp/messages/${phone}`);
    const apiMessages = res.data.data as ApiMessage[];

    return apiMessages.map((m) => ({
      id: String(m.id),
      text: m.message,
      fromMe: m.sender_type === "ai",
      time: formatChatTime(m.created_at),
    }));
  } catch (error) {
    console.error(`❌ Failed to fetch WhatsApp messages for ${phone}:`, error);
    throw error; // important for react-query error handling
  }
}
