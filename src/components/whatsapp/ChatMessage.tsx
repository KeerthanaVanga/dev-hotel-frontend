import type { Message } from "../../types/Chat";
import { parseWhatsAppPayload } from "../../utils/parseWhatsappMessag";
import TemplateMessage from "./TemplateMessage";

export default function ChatMessage({ message }: { message: Message }) {
  const payload = parseWhatsAppPayload(message.text);

  /* ---------- TEMPLATE ---------- */
  if (payload && "components" in payload) {
    return (
      <TemplateMessage
        template={payload}
        fromMe={message.fromMe}
        time={message.time}
      />
    );
  }

  /* ---------- TEXT PAYLOAD ---------- */
  if (payload && payload.type === "text") {
    return (
      <div
        className={`max-w-[50%] rounded-lg px-4 py-2 text-sm
          ${
            message.fromMe
              ? "ml-auto bg-[#0A5C44] text-white"
              : "bg-[#2A161B] text-[#F5DEB3]"
          }
        `}
      >
        <p className="whitespace-pre-line">{payload.text.body}</p>
        <span className="block text-[10px] opacity-60 text-right">
          {message.time}
        </span>
      </div>
    );
  }

  /* ---------- FALLBACK ---------- */
  return (
    <div
      className={`max-w-[50%] rounded-lg px-4 py-2 text-sm
        ${
          message.fromMe
            ? "ml-auto bg-[#0A5C44] text-white"
            : "bg-[#2A161B] text-[#F5DEB3]"
        }
      `}
    >
      <p className="whitespace-pre-line">{message.text}</p>
      <span className="block text-[10px] opacity-60 text-right">
        {message.time}
      </span>
    </div>
  );
}
