import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export type FormActionsProps = {
  step: number;
  onBack: () => void;
  onNext: () => void | Promise<void>;
  onCreate: () => void;
  isNextLoading: boolean;
  isCreateLoading: boolean;
  submitLabel?: string;
  submitLoadingLabel?: string;
};

export function FormActions({
  step,
  onBack,
  onNext,
  onCreate,
  isNextLoading,
  isCreateLoading,
  submitLabel = "Create booking",
  submitLoadingLabel = "Creating…",
}: FormActionsProps) {
  return (
    <div className="flex justify-between gap-3 border-t border-[#3A1A22] pt-4">
      {step > 1 ? (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-md border border-[#3A1A22] bg-[#241217] px-4 py-2 text-sm font-medium text-[#F5DEB3] transition-colors hover:border-[#D4AF37]/50 hover:bg-[#241217]/90"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
      ) : (
        <div />
      )}

      {step < 3 ? (
        <button
          type="button"
          disabled={isNextLoading}
          onClick={onNext}
          className="flex items-center gap-2 rounded-md bg-[#D4AF37] px-4 py-2 text-sm font-medium text-[#1F1216] transition-colors hover:bg-[#D4AF37]/90 disabled:opacity-60"
        >
          {isNextLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking…
            </>
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          disabled={isCreateLoading}
          onClick={onCreate}
          className="flex items-center gap-2 rounded-md bg-[#D4AF37] px-4 py-2 text-sm font-medium text-[#1F1216] transition-colors hover:bg-[#D4AF37]/90 disabled:opacity-60"
        >
          {isCreateLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {submitLoadingLabel}
            </>
          ) : (
            submitLabel
          )}
        </button>
      )}
    </div>
  );
}
