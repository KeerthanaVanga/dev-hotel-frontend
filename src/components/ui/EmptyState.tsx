import type { ReactNode } from "react";
import { Users } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/15">
        {icon ?? <Users className="h-8 w-8 text-[#D4AF37]" />}
      </div>

      <h3 className="text-lg font-serif text-[#F5DEB3]">{title}</h3>

      <p className="mt-2 max-w-sm text-sm text-[#F5DEB3]/60">{description}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 rounded-md bg-[#D4AF37] px-5 py-2 text-sm font-semibold text-[#1B0F12] hover:bg-[#c9a633]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
