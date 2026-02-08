import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
  id?: string;
  "data-testid"?: string;
}

export default function PasswordInput({
  label,
  value,
  onChange,
  required,
  minLength,
  placeholder,
  id,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm text-[#F5DEB3]/80">
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          minLength={minLength}
          placeholder={placeholder}
          className="w-full rounded-md border-2 border-[#3A1A22] bg-[#1F1216] px-3 py-2 pr-10 text-sm text-[#F5DEB3] focus:border-[#D4AF37] focus:outline-none placeholder:text-[#F5DEB3]/40"
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#F5DEB3]/60 hover:text-[#D4AF37] transition p-1 rounded"
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
