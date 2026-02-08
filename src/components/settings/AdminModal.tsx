import { X } from "lucide-react";
import { useState } from "react";
import PasswordInput from "../ui/PasswordInput";

export type AdminFormPayload = {
  username: string;
  email: string;
  password: string;
};

type Mode = "add" | "edit";

interface Props {
  open: boolean;
  mode: Mode;
  initialValues?: { username: string; email: string };
  isLoading: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (data: AdminFormPayload) => void;
}

export default function AdminModal({
  open,
  mode,
  initialValues,
  isLoading,
  errorMessage,
  onClose,
  onSubmit,
}: Props) {
  const [username, setUsername] = useState(initialValues?.username ?? "");
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [password, setPassword] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "add" && !password.trim()) return;
    onSubmit({
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B0F12]/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-xl border border-[#3A1A22] bg-[#241217] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        {errorMessage && (
          <div className="rounded-t-xl border-b border-[#3A1A22] bg-red-900/40 px-6 py-3 text-sm text-red-200">
            {errorMessage}
          </div>
        )}

        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3A1A22]">
          <h3 className="text-lg font-serif text-[#F5DEB3] tracking-wide">
            {mode === "edit" ? "Edit Admin" : "Add Admin"}
          </h3>
          <button
            onClick={onClose}
            className="text-[#F5DEB3]/60 hover:text-[#F5DEB3]"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="space-y-2">
            <label className="block text-sm text-[#F5DEB3]/80">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-md border-2 border-[#3A1A22] bg-[#1F1216] px-3 py-2 text-sm text-[#F5DEB3] focus:border-[#D4AF37] focus:outline-none placeholder:text-[#F5DEB3]/40"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-[#F5DEB3]/80">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border-2 border-[#3A1A22] bg-[#1F1216] px-3 py-2 text-sm text-[#F5DEB3] focus:border-[#D4AF37] focus:outline-none placeholder:text-[#F5DEB3]/40"
            />
          </div>

          <PasswordInput
            label={
              mode === "edit"
                ? "New password (leave blank to keep current)"
                : "Password"
            }
            value={password}
            onChange={setPassword}
            required={mode === "add"}
            minLength={mode === "add" ? 6 : undefined}
            placeholder={mode === "edit" ? "Optional" : ""}
          />

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#3A1A22]">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm text-[#F5DEB3]/70 hover:text-[#F5DEB3] disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isLoading ||
                !username.trim() ||
                !email.trim() ||
                (mode === "add" && !password)
              }
              className="inline-flex items-center gap-2 rounded-md bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#1B0F12] hover:bg-[#c9a633] disabled:opacity-60"
            >
              {isLoading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1B0F12] border-t-transparent" />
              )}
              {mode === "edit" ? "Update" : "Add Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
