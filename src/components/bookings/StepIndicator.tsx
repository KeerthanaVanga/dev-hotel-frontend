import { CalendarDays, User, CreditCard, ChevronRight } from "lucide-react";
import { STEPS } from "../../utils/booking";

const STEP_ICONS = {
  CalendarDays,
  User,
  CreditCard,
} as const;

export type StepIndicatorProps = {
  currentStep: number;
};

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      {STEPS.map((s, i) => {
        const Icon = STEP_ICONS[s.iconKey];
        const isActive = currentStep === s.id;
        const isPast = currentStep > s.id;
        return (
          <div key={s.id} className="flex flex-1 items-center">
            <div
              className={`flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 ${
                isActive
                  ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#F5DEB3]"
                  : isPast
                    ? "border-[#3A1A22] bg-[#241217] text-[#F5DEB3]/70"
                    : "border-[#3A1A22] bg-[#241217]/50 text-[#F5DEB3]/50"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate text-xs font-medium md:text-sm">
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight className="mx-1 h-4 w-4 shrink-0 text-[#3A1A22]" />
            )}
          </div>
        );
      })}
    </div>
  );
}
