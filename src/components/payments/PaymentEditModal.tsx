import { useState } from "react";
import type {
  Payment,
  PaymentMethodOption,
  PaymentStatusOption,
} from "../../types/Payment";

const PAYMENT_METHOD_OPTIONS: PaymentMethodOption[] = [
  "partial_online",
  "full_online",
  "offline",
];

const PAYMENT_STATUS_OPTIONS: PaymentStatusOption[] = [
  "partial_paid",
  "paid",
  "pending",
];

interface Props {
  payment: Payment;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (payload: {
    bill_paid_amount: number;
    method: PaymentMethodOption;
    status: PaymentStatusOption;
  }) => void;
}

export default function PaymentEditModal({
  payment,
  isSaving = false,
  onClose,
  onSave,
}: Props) {
  const [billPaid, setBillPaid] = useState(payment.billPaid);
  const [method, setMethod] = useState<PaymentMethodOption>(
    (payment.paymentMethod as PaymentMethodOption) || "offline",
  );
  const [status, setStatus] = useState<PaymentStatusOption>(
    (payment.status as PaymentStatusOption) || "pending",
  );

  const handleSave = () => {
    onSave({
      bill_paid_amount: Number(billPaid),
      method,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-xl border border-[#3A1A22] bg-[#241217] p-6 space-y-5">
        {/* Header */}
        <h2 className="text-lg font-serif text-[#F5DEB3]">Edit Payment</h2>

        {/* Amount to add to paid (backend adds this to existing paid) */}
        <Input
          label="Amount paying now"
          type="number"
          value={billPaid}
          onChange={(v) => setBillPaid(Number(v) || 0)}
        />

        {/* Payment Method */}
        <Select<PaymentMethodOption>
          label="Payment method"
          value={method}
          options={PAYMENT_METHOD_OPTIONS}
          onChange={setMethod}
        />

        {/* Payment Status */}
        <Select<PaymentStatusOption>
          label="Payment status"
          value={status}
          options={PAYMENT_STATUS_OPTIONS}
          onChange={setStatus}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-sm text-[#F5DEB3]/70 hover:text-[#F5DEB3] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="
              rounded-md bg-[#D4AF37] px-5 py-2
              text-sm font-semibold text-[#1B0F12]
              hover:bg-[#E5C453] disabled:opacity-50 disabled:pointer-events-none
            "
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reusable Typed Inputs                                               */
/* ------------------------------------------------------------------ */

interface InputProps {
  label: string;
  value: string | number;
  type?: "text" | "number";
  onChange: (value: string) => void;
}

function Input({ label, value, type = "text", onChange }: InputProps) {
  return (
    <div>
      <label className="block mb-1 text-sm text-[#F5DEB3]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full rounded-md border border-[#3A1A22]
          bg-[#1F1216] px-3 py-2
          text-[#F5DEB3]
          focus:border-[#D4AF37] focus:outline-none
        "
      />
    </div>
  );
}

interface SelectProps<T extends string> {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: SelectProps<T>) {
  return (
    <div>
      <label className="block mb-1 text-sm text-[#F5DEB3]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="
          w-full rounded-md border border-[#3A1A22]
          bg-[#1F1216] px-3 py-2
          text-[#F5DEB3]
          focus:border-[#D4AF37] focus:outline-none
        "
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
