/* ================= TEXT MESSAGE ================= */

export type WhatsAppTextPayload = {
  messaging_product: "whatsapp";
  type: "text";
  to: string;
  text: {
    body: string;
  };
};

/* ================= TEMPLATE ================= */

export type WhatsAppTemplate = {
  name: string;
  language: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  components: TemplateComponent[];
};

/* ================= COMPONENT UNION ================= */

export type TemplateComponent =
  | HeaderComponent
  | BodyComponent
  | ButtonsComponent;

/* ================= HEADER ================= */

export type HeaderComponent = {
  type: "HEADER";
  format: "IMAGE";
  example?: {
    header_handle: string[];
  };
};

/* ================= BODY ================= */

export type BodyComponent = {
  type: "BODY";
  text: string;
};

/* ================= BUTTONS ================= */

export type ButtonsComponent = {
  type: "BUTTONS";
  buttons: TemplateButton[];
};

export type TemplateButton = {
  type: "QUICK_REPLY";
  text: string;
};

/* ================= UNION PAYLOAD ================= */

export type WhatsAppMessagePayload = WhatsAppTextPayload | WhatsAppTemplate;
