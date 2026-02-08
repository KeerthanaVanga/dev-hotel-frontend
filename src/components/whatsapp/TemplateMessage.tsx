import type {
  WhatsAppTemplate,
  HeaderComponent,
  BodyComponent,
  ButtonsComponent,
} from "../../types/WhatsappTemplates";

type Props = {
  template: WhatsAppTemplate;
  fromMe: boolean;
  time: string;
};

export default function TemplateMessage({ template, fromMe, time }: Props) {
  const header = template.components.find(
    (c): c is HeaderComponent => c.type === "HEADER" && c.format === "IMAGE",
  );

  const body = template.components.find(
    (c): c is BodyComponent => c.type === "BODY",
  );

  const buttons = template.components.find(
    (c): c is ButtonsComponent => c.type === "BUTTONS",
  );

  return (
    <div
      className={`max-w-[50%] rounded-xl overflow-hidden border text-sm
        ${
          fromMe
            ? "ml-auto bg-[#0A5C44] text-white"
            : "bg-[#2A161B] text-[#F5DEB3]"
        }
      `}
    >
      {/* HEADER IMAGE */}
      {header?.example?.header_handle?.[0] && (
        <img
          src={header.example.header_handle[0]}
          className="w-full h-40 object-cover"
          alt="Template Header"
        />
      )}

      {/* BODY */}
      {body?.text && <div className="p-4 whitespace-pre-line">{body.text}</div>}

      {/* BUTTONS */}
      {buttons?.buttons && (
        <div className="border-t border-[#3A1A22]">
          {buttons.buttons.map((btn, idx) => (
            <button
              key={idx}
              className="w-full py-3 text-center text-[#25D366] hover:bg-black/10 border-t border-[#3A1A22]"
            >
              {btn.text}
            </button>
          ))}
        </div>
      )}

      <div className="px-3 pb-2 text-[10px] opacity-60 text-right">{time}</div>
    </div>
  );
}
