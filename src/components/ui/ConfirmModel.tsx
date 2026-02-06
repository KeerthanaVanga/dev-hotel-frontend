// src/components/ui/ConfirmModal.tsx
export default function ConfirmModal({
  open,
  title,
  description,
  confirmText,
  cancelText,
  destructive,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-[#3A1A22] bg-[#241217] p-5">
        <h2 className="text-lg font-semibold text-[#F5DEB3]">{title}</h2>
        <p className="mt-2 text-sm text-[#F5DEB3]/70">{description}</p>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onCancel}
            className="w-full rounded-lg border border-[#3A1A22] py-2 text-sm text-[#F5DEB3] hover:bg-white/5"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`w-full rounded-lg py-2 text-sm font-medium ${
              destructive
                ? "bg-red-500/20 text-red-300 hover:bg-red-500/25"
                : "bg-[#D4AF37] text-[#241217]"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
