import * as Yup from "yup";
import { parseISO, differenceInDays, isWithinInterval } from "date-fns";

export type CreateBookingStep = 1 | 2 | 3;

export const STEPS = [
  { id: 1, label: "Room & dates", iconKey: "CalendarDays" },
  { id: 2, label: "Guest details", iconKey: "User" },
  { id: 3, label: "Payment", iconKey: "CreditCard" },
] as const;

export const step1Schema = Yup.object({
  room_id: Yup.string().required("Please select a room"),
  check_in: Yup.string().required("Check-in date is required"),
  check_out: Yup.string()
    .required("Check-out date is required")
    .test(
      "after-checkin",
      "Check-out must be after check-in",
      function (value) {
        const { check_in } = this.parent;
        if (!check_in || !value) return true;
        return new Date(value) > new Date(check_in);
      },
    ),
});

export const step2Schema = Yup.object({
  guest_type: Yup.string().oneOf(["new", "existing"]).required(),
  selected_user_id: Yup.string().when("guest_type", {
    is: "existing",
    then: (s) => s.required("Please select a user"),
    otherwise: (s) => s.optional(),
  }),
  guest_name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .required("Guest name is required"),
  guest_email: Yup.string().email("Invalid email").optional(),
  whatsapp_number: Yup.string()
    .trim()
    .required("WhatsApp number is required")
    .min(10, "Enter a valid WhatsApp number (at least 10 digits)"),
  adults: Yup.string()
    .required("Required")
    .test("min", "At least 1 adult", (v) => Number(v) >= 1),
  children: Yup.string()
    .optional()
    .test("min", "Cannot be negative", (v) => (v ? Number(v) >= 0 : true)),
});

export const step3Schema = Yup.object({
  payment_method: Yup.string()
    .oneOf(["online", "partial", "offline"], "Select a payment method")
    .required("Payment method is required"),
});

export function getStepSchema(step: number) {
  switch (step) {
    case 1:
      return step1Schema;
    case 2:
      return step2Schema;
    case 3:
      return step3Schema;
    default:
      return step1Schema;
  }
}

export const PAYMENT_OPTIONS: {
  value: "online" | "partial" | "offline";
  label: string;
}[] = [
  { value: "online", label: "Online payment" },
  { value: "partial", label: "Partial payment" },
  { value: "offline", label: "Offline payment" },
];

export type RoomForPrice = {
  room_id: number;
  price: string;
  room_name: string | null;
  room_type?: string;
};

export type OfferForPrice = {
  room_id: number;
  offer_price: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean | null;
};

export function getPriceAndNights(
  roomId: string,
  checkIn: string,
  checkOut: string,
  rooms: RoomForPrice[],
  offers: OfferForPrice[],
) {
  const roomIdNum = Number(roomId);
  const room = rooms.find((r) => r.room_id === roomIdNum);
  if (!room || !checkIn || !checkOut)
    return {
      originalPricePerNight: 0,
      offerPricePerNight: null as number | null,
      pricePerNight: 0,
      nights: 0,
      total: 0,
      isOffer: false,
    };
  const checkInDate = parseISO(checkIn);
  const checkOutDate = parseISO(checkOut);
  const nights = Math.max(1, differenceInDays(checkOutDate, checkInDate));
  const roomPrice = Number(room.price);

  const roomOffers = offers.filter(
    (o) => o.room_id === roomIdNum && o.is_active,
  );

  const activeOffer = roomOffers.find((o) => {
    if (!o.start_date || !o.end_date) return true;
    const start = parseISO(o.start_date);
    const end = parseISO(o.end_date);
    return (
      isWithinInterval(checkInDate, { start, end }) &&
      isWithinInterval(checkOutDate, { start, end })
    );
  });

  const offerPricePerNight = activeOffer?.offer_price
    ? Number(activeOffer.offer_price)
    : null;
  const pricePerNight = offerPricePerNight ?? roomPrice;
  const total = pricePerNight * nights;
  return {
    originalPricePerNight: roomPrice,
    offerPricePerNight,
    pricePerNight,
    nights,
    total,
    isOffer: Boolean(activeOffer),
  };
}
