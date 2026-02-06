import { Loader2 } from "lucide-react";

interface AuthButtonProps {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function AuthButton({
  label,
  loading,
  disabled,
  className = "",
}: AuthButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        w-full flex items-center justify-center gap-2 rounded-md
        bg-[#D4AF37] py-2 text-sm font-semibold text-[#5A0F1B]
        hover:bg-[#c9a633] transition
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading && <Loader2 className="animate-spin" size={16} />}
      {label}
    </button>
  );
}
