export type GuestType = "new" | "existing";

export type CreateBookingFormValues = {
  room_id: string;
  check_in: string;
  check_out: string;
  guest_type: GuestType;
  /** When guest_type is "existing", selected user id (empty until user is selected) */
  selected_user_id: string;
  guest_name: string;
  guest_email: string;
  whatsapp_number: string;
  adults: string;
  children: string;
  payment_method: "online" | "partial" | "offline";
};

export const INITIAL_CREATE_BOOKING_FORM: CreateBookingFormValues = {
  room_id: "",
  check_in: "",
  check_out: "",
  guest_type: "new",
  selected_user_id: "",
  guest_name: "",
  guest_email: "",
  whatsapp_number: "",
  adults: "1",
  children: "0",
  payment_method: "online",
};

export type PaymentMethodOption = "online" | "partial" | "offline";
