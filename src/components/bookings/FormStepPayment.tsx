import { format, parseISO } from "date-fns";
import type { FormikProps } from "formik";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../../api/rooms.api";
import { getOffers } from "../../api/offers.api";
import type { CreateBookingFormValues } from "../../types/CreateBookingForm";
import { getPriceAndNights, PAYMENT_OPTIONS } from "../../utils/booking";

export type FormStepPaymentProps = Pick<
  FormikProps<CreateBookingFormValues>,
  "values" | "setFieldValue" | "setFieldTouched" | "errors" | "touched"
>;

export function FormStepPayment({
  values,
  setFieldValue,
  setFieldTouched,
  errors,
  touched,
}: FormStepPaymentProps) {
  const { data: roomsData } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });
  const { data: offersData } = useQuery({
    queryKey: ["offers"],
    queryFn: getOffers,
  });
  const rooms = roomsData?.data ?? [];
  const offers = Array.isArray(offersData) ? offersData : [];
  const {
    originalPricePerNight,
    offerPricePerNight,
    pricePerNight,
    nights,
    total,
    isOffer,
  } = getPriceAndNights(
    values.room_id,
    values.check_in,
    values.check_out,
    rooms,
    offers.map((o) => ({
      room_id: o.room_id,
      offer_price: o.offer_price,
      start_date: o.start_date,
      end_date: o.end_date,
      is_active: o.is_active,
    })),
  );

  const selectedRoom = rooms.find((r) => r.room_id === Number(values.room_id));
  const roomName = selectedRoom?.room_name || selectedRoom?.room_type || "—";
  const checkInFormatted = values.check_in
    ? format(parseISO(values.check_in), "dd MMM yyyy")
    : "—";
  const checkOutFormatted = values.check_out
    ? format(parseISO(values.check_out), "dd MMM yyyy")
    : "—";

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
      <div className="min-w-0 flex-1 rounded-lg border border-[#3A1A22] bg-[#241217]/80 p-4">
        <p className="mb-3 text-sm font-medium text-[#F5DEB3]">
          Booking summary
        </p>
        <div className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div className="flex justify-between gap-2 text-[#F5DEB3]/80 sm:flex-row">
            <span>Room</span>
            <span className="text-right text-[#F5DEB3]">{roomName}</span>
          </div>
          <div className="flex justify-between gap-2 text-[#F5DEB3]/80 sm:flex-row">
            <span>Check-in</span>
            <span className="text-right text-[#F5DEB3]">
              {checkInFormatted}
            </span>
          </div>
          <div className="flex justify-between gap-2 text-[#F5DEB3]/80 sm:flex-row">
            <span>Check-out</span>
            <span className="text-right text-[#F5DEB3]">
              {checkOutFormatted}
            </span>
          </div>
          <div className="flex justify-between gap-2 text-[#F5DEB3]/80 sm:flex-row">
            <span>Guest</span>
            <span className="text-right text-[#F5DEB3]">
              {values.guest_name || "—"}
            </span>
          </div>
          {values.guest_email?.trim() && (
            <div className="flex justify-between gap-2 text-[#F5DEB3]/80 sm:flex-row">
              <span>Email</span>
              <span className="text-right text-[#F5DEB3]">
                {values.guest_email}
              </span>
            </div>
          )}
          <div className="flex justify-between gap-2 text-[#F5DEB3]/80 sm:flex-row">
            <span>WhatsApp</span>
            <span className="text-right text-[#F5DEB3]">
              {values.whatsapp_number || "—"}
            </span>
          </div>
          <div className="flex justify-between gap-2 text-[#F5DEB3]/80 sm:flex-row">
            <span>Adults</span>
            <span className="text-right text-[#F5DEB3]">{values.adults}</span>
          </div>
          <div className="flex justify-between gap-2 text-[#F5DEB3]/80 sm:flex-row">
            <span>Children</span>
            <span className="text-right text-[#F5DEB3]">
              {values.children || "0"}
            </span>
          </div>
        </div>
        <div className="mt-3 space-y-2 border-t border-[#3A1A22] pt-3 text-sm">
          <div className="flex justify-between text-[#F5DEB3]/80">
            <span>Original price (from room, per night)</span>
            <span>₹{originalPricePerNight.toLocaleString()}</span>
          </div>
          {isOffer && offerPricePerNight != null && (
            <>
              <div className="flex justify-between text-[#D4AF37]">
                <span>Discounted price (from offer, per night)</span>
                <span>₹{offerPricePerNight.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#F5DEB3]/80">
                <span>Per night price (after discount)</span>
                <span>₹{pricePerNight.toLocaleString()}</span>
              </div>
            </>
          )}
          {!isOffer && (
            <div className="flex justify-between text-[#F5DEB3]/80">
              <span>Per night price</span>
              <span>₹{pricePerNight.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-[#F5DEB3]/80">
            <span>Nights</span>
            <span>{nights}</span>
          </div>
          <div className="flex justify-between text-[#F5DEB3] font-medium">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 shrink-0 flex-col lg:w-72">
        <p className="mb-2 text-sm text-[#F5DEB3]/80">
          Choose how the guest will pay for this booking.
        </p>
        <div className="space-y-2">
          {PAYMENT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all ${
                values.payment_method === opt.value
                  ? "border-[#D4AF37] bg-[#D4AF37]/10"
                  : "border-[#3A1A22] bg-[#241217] hover:border-[#3A1A22]/80"
              }`}
            >
              <input
                type="radio"
                name="payment_method"
                value={opt.value}
                checked={values.payment_method === opt.value}
                onChange={() => setFieldValue("payment_method", opt.value)}
                onBlur={() => setFieldTouched("payment_method", true)}
                className="h-4 w-4 accent-[#D4AF37]"
              />
              <span className="text-[#F5DEB3]">{opt.label}</span>
            </label>
          ))}
          <div className="min-h-[1.25rem] text-xs text-red-400">
            {touched.payment_method &&
              errors.payment_method &&
              errors.payment_method}
          </div>
        </div>
      </div>
    </div>
  );
}
