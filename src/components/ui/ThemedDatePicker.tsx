import DatePicker from "react-datepicker";
import { format, parseISO, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import "react-datepicker/dist/react-datepicker.css";

export interface ThemedDatePickerProps {
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
  min?: string; // YYYY-MM-DD
  max?: string; // YYYY-MM-DD
  placeholder?: string;
}

export function ThemedDatePicker({
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  min,
  max,
  placeholder = "Select date",
}: ThemedDatePickerProps) {
  const selectedDate =
    value && isValid(parseISO(value)) ? parseISO(value) : null;
  const minDate = min && isValid(parseISO(min)) ? parseISO(min) : undefined;
  const maxDate = max && isValid(parseISO(max)) ? parseISO(max) : undefined;

  const handleChange = (date: Date | null) => {
    onChange(date ? format(date, "yyyy-MM-dd") : "");
  };

  return (
    <div className="relative space-y-1">
      <label className="text-sm font-medium text-[#F5DEB3]">{label}</label>

      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#D4AF37]/80">
          <CalendarIcon className="h-4 w-4" />
        </div>
        <DatePicker
          selected={selectedDate}
          onChange={handleChange}
          onBlur={onBlur}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText={placeholder}
          dateFormat="dd MMM yyyy"
          showMonthDropdown={false}
          showYearDropdown={false}
          calendarClassName="themed-datepicker-calendar"
          wrapperClassName="themed-datepicker-wrapper w-full block"
          className={`
            w-full rounded-md border-2 bg-[#241217] py-2 pl-10 pr-3 text-left text-sm text-[#F5DEB3] transition-all
            ${touched && error ? "border-red-500" : "border-[#3A1A22]"}
            hover:border-[#D4AF37]/60
            focus:border-[#D4AF37] focus:outline-none focus:ring-0 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]
            placeholder:text-[#F5DEB3]/50
          `}
        />
      </div>

      <div className="min-h-[1.25rem] text-xs text-red-400">
        {touched && error && error}
      </div>
    </div>
  );
}
