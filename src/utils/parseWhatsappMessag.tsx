import type {
  WhatsAppMessagePayload,
  WhatsAppTextPayload,
  WhatsAppTemplate,
} from "../types/WhatsappTemplates";

export function parseWhatsAppPayload(
  raw: string,
): WhatsAppMessagePayload | null {
  try {
    const parsed = JSON.parse(raw);

    // TEXT MESSAGE
    if (parsed?.type === "text" && parsed?.text?.body) {
      return parsed as WhatsAppTextPayload;
    }

    // TEMPLATE MESSAGE
    if (Array.isArray(parsed?.components)) {
      return parsed as WhatsAppTemplate;
    }

    return null;
  } catch {
    return null;
  }
}
