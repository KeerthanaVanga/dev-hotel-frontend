import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "warning";

export interface ToastData {
  id: number;
  type: ToastType;
  message: string;
}

const styles = {
  success: {
    icon: <CheckCircle size={18} className="text-[#4ADE80]" />,
    border: "border-[#4ADE80]/40",
  },
  error: {
    icon: <XCircle size={18} className="text-red-400" />,
    border: "border-red-400/40",
  },
  warning: {
    icon: <AlertTriangle size={18} className="text-[#FACC15]" />,
    border: "border-[#FACC15]/40",
  },
};

export function Toast({ toast }: { toast: ToastData }) {
  const variant = styles[toast.type];

  return (
    <div
      className={`
        flex items-center gap-3 rounded-lg
        bg-[#241217] px-4 py-3
        border border-l-4 ${variant.border}
        shadow-[0_10px_30px_rgba(0,0,0,0.35)]
      `}
    >
      {variant.icon}
      <p className="text-sm text-[#F5DEB3] leading-snug">{toast.message}</p>
    </div>
  );
}
