import { addDays, format, parseISO } from "date-fns";
import type { FormikProps } from "formik";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../../api/rooms.api";
import type { CreateBookingFormValues } from "../../types/CreateBookingForm";
import { ThemedDatePicker } from "../ui/ThemedDatePicker";

export type FormStepRoomDatesProps = Pick<
  FormikProps<CreateBookingFormValues>,
  "values" | "setFieldValue" | "setFieldTouched" | "errors" | "touched"
>;

export function FormStepRoomDates({
  values,
  setFieldValue,
  setFieldTouched,
  errors,
  touched,
}: FormStepRoomDatesProps) {
  const { data: roomsData } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });
  const rooms = roomsData?.data ?? [];

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4">
      <div className="min-w-0 [grid-column:1/-1]">
        <label className="mb-1 block text-sm font-medium text-[#F5DEB3]">
          Room
        </label>
        <select
          value={values.room_id}
          onChange={(e) => setFieldValue("room_id", e.target.value)}
          onBlur={() => setFieldTouched("room_id", true)}
          className="w-full rounded-md border-2 border-[#3A1A22] bg-[#241217] px-3 py-2 text-sm text-[#F5DEB3] transition-all focus:border-[#D4AF37] focus:outline-none focus:ring-0 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]"
        >
          <option value="">Select a room</option>
          {rooms.map((r) => (
            <option key={r.room_id} value={r.room_id}>
              {r.room_name || `${r.room_type} #${r.room_number}`} — ₹{r.price}
              /night
            </option>
          ))}
        </select>
        <div className="min-h-[1.25rem] pt-1 text-xs text-red-400">
          {touched.room_id && errors.room_id && errors.room_id}
        </div>
      </div>

      <div>
        <ThemedDatePicker
          label="Check-in date"
          value={values.check_in}
          onChange={(v) => setFieldValue("check_in", v)}
          onBlur={() => setFieldTouched("check_in", true)}
          error={errors.check_in}
          touched={touched.check_in}
          min={format(new Date(), "yyyy-MM-dd")}
          placeholder="Select check-in date"
        />
      </div>

      <div>
        <ThemedDatePicker
          label="Check-out date"
          value={values.check_out}
          onChange={(v) => setFieldValue("check_out", v)}
          onBlur={() => setFieldTouched("check_out", true)}
          error={errors.check_out}
          touched={touched.check_out}
          min={
            values.check_in
              ? format(addDays(parseISO(values.check_in), 1), "yyyy-MM-dd")
              : format(new Date(), "yyyy-MM-dd")
          }
          placeholder="Select check-out date"
        />
      </div>
    </div>
  );
}
