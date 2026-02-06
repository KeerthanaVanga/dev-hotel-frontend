import { X } from "lucide-react";
import { useEffect, useState } from "react";

/* ---------------------------------- */
/* Types                              */
/* ---------------------------------- */

export type AddUserPayload = {
  name: string;
  email: string;
  whatsapp: string;
};

type Mode = "add" | "edit";

interface Props {
  open: boolean;
  mode: Mode;
  title?: string;
  initialValues?: AddUserPayload;
  isLoading: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (data: AddUserPayload) => void; // mutation is triggered outside
}

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

export default function AddUserModal({
  open,
  mode,
  title,
  initialValues,
  isLoading,
  errorMessage,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<AddUserPayload>({
    name: "",
    email: "",
    whatsapp: "",
  });

  useEffect(() => {
    if (open) {
      setForm(initialValues ?? { name: "", email: "", whatsapp: "" });
    }
  }, [open, initialValues]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B0F12]/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-xl border border-[#3A1A22] bg-[#241217] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        {/* Error banner */}
        {errorMessage && (
          <div className="rounded-t-xl border-b border-[#3A1A22] bg-red-900/40 px-6 py-3 text-sm text-red-200">
            {errorMessage}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3A1A22]">
          <h3 className="text-lg font-serif text-[#F5DEB3] tracking-wide">
            {title ?? (mode === "edit" ? "Edit User" : "Add User")}
          </h3>
          <button
            onClick={onClose}
            className="text-[#F5DEB3]/60 hover:text-[#F5DEB3]"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <Input
            label="Username"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />

          <Input
            label="WhatsApp Number"
            value={form.whatsapp}
            onChange={(v) => setForm({ ...form, whatsapp: v })}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#3A1A22]">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm text-[#F5DEB3]/70 hover:text-[#F5DEB3] disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={() => onSubmit(form)}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-md bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#1B0F12] hover:bg-[#c9a633] disabled:opacity-60"
          >
            {isLoading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1B0F12] border-t-transparent" />
            )}
            {mode === "edit" ? "Update User" : "Add User"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Input                              */
/* ---------------------------------- */

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-[#F5DEB3]/80">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border-2 border-[#3A1A22] bg-[#1F1216] px-3 py-2 text-sm text-[#F5DEB3] focus:border-[#D4AF37] focus:outline-none placeholder:text-[#F5DEB3]/40"
      />
    </div>
  );
}
