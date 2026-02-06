import type { InputHTMLAttributes } from "react";
import { useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  touched?: boolean;
  icon?: React.ReactNode;
}

export function AuthInput({
  label,
  error,
  touched,
  icon,
  type,
  ...props
}: Props) {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-[#F5DEB3]">{label}</label>

      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]/70">
            {icon}
          </div>
        )}

        <input
          {...props}
          type={isPassword && showPassword ? "text" : type}
          className={`
    w-full rounded-md bg-[#241217] px-3 py-2 text-sm text-[#F5DEB3]
    border-2 transition-all
    ${icon ? "pl-10" : "pl-3"}
    ${isPassword ? "pr-10" : "pr-3"}

    ${
      touched && error
        ? "border-red-500 focus:border-red-500 focus:ring-0"
        : "border-[#3A1A22] focus:border-[#D4AF37] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]"
    }
    focus:outline-none placeholder:text-[#F5DEB3]/40
  `}
        />

        {/* Show / Hide Password */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4AF37]/70 hover:text-[#D4AF37]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Error Message */}
      <div className="min-h-5 flex items-center gap-1 text-xs text-red-400">
        {touched && error && (
          <>
            <AlertCircle size={14} />
            {error}
          </>
        )}
      </div>
    </div>
  );
}
