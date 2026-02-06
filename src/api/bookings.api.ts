import axiosInstance from "../lib/axios-interceptor";

export type ApiBooking = {
  booking_id: string;
  status: string;
  adults: number;
  children: number;
  guests_total: number;
  check_in: string;
  check_out: string;
  created_at: string;

  users: {
    user_id: number;
    name: string;
    email: string;
    whatsapp_number?: string;
  };

  rooms: {
    room_id: number;
    room_type: string;
    room_name: string;
    room_number: number;
    price: string;
  };
};

export type ApiBookingDetail = ApiBooking & {
  users: ApiBooking["users"] & { whatsapp_number?: string };
  payments: { method: string }[];
};

export type GetBookingByIdResponse = {
  success: boolean;
  data: ApiBookingDetail;
};

export type GetBookingsResponse = {
  success: boolean;
  count: number;
  data: ApiBooking[];
};

export async function getUpcomingBookings() {
  const res =
    await axiosInstance.get<GetBookingsResponse>("/bookings/upcoming");

  if (!res.data.success) {
    throw new Error("Failed to fetch bookings");
  }

  return res.data;
}

export async function getBookingById(bookingId: string) {
  const res = await axiosInstance.get<GetBookingByIdResponse>(
    `/bookings/${bookingId}`,
  );
  if (!res.data.success) {
    throw new Error("Failed to fetch booking");
  }
  return res.data;
}

/** Format ISO date string to YYYY-MM-DD for form fields */
export function toDateOnly(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Map API booking detail to CreateBookingFormValues for reschedule prefill */
export function bookingDetailToFormValues(
  b: ApiBookingDetail,
): import("../types/CreateBookingForm").CreateBookingFormValues {
  const paymentMethod = b.payments?.[0]?.method;
  const validPayment: "online" | "partial" | "offline" =
    paymentMethod === "online" ||
    paymentMethod === "partial" ||
    paymentMethod === "offline"
      ? paymentMethod
      : "online";
  return {
    room_id: String(b.rooms?.room_id ?? ""),
    check_in: toDateOnly(b.check_in),
    check_out: toDateOnly(b.check_out),
    guest_type: "existing" as const,
    selected_user_id: b.users?.user_id != null ? String(b.users.user_id) : "",
    guest_name: b.users?.name ?? "",
    guest_email: b.users?.email ?? "",
    whatsapp_number:
      b.users?.whatsapp_number != null ? String(b.users.whatsapp_number) : "",
    adults: String(b.adults ?? 1),
    children: String(b.children ?? 0),
    payment_method: validPayment,
  };
}

export type CheckAvailabilityPayload = {
  room_id: number;
  check_in: string;
  check_out: string;
};

export type CheckAvailabilityResponse = {
  success: boolean;
  available: boolean;
  message?: string;
};

export async function checkAvailability(payload: CheckAvailabilityPayload) {
  const res = await axiosInstance.post<CheckAvailabilityResponse>(
    "/bookings/check-availability",
    payload,
  );
  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to check availability");
  }
  return res.data;
}

export type CreateBookingPayload = {
  room_id: number;
  check_in: string;
  check_out: string;
  /** When provided, booking is linked to this existing user instead of creating a new one */
  user_id?: number;
  guest_name: string;
  guest_email?: string;
  whatsapp_number: string;
  adults: number;
  children?: number;
  payment_method: "online" | "partial" | "offline";
};

export type CreateBookingResponse = {
  success: boolean;
  data: { booking_id: string; [key: string]: unknown };
  message: string;
};

export async function createBooking(payload: CreateBookingPayload) {
  const res = await axiosInstance.post<CreateBookingResponse>(
    "/bookings",
    payload,
  );

  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to create booking");
  }

  return res.data;
}

export type CancelBookingResponse = {
  success: boolean;
  data: unknown;
  message: string;
};

export async function cancelBooking(bookingId: string) {
  const res = await axiosInstance.patch<CancelBookingResponse>(
    `/bookings/${bookingId}/status`,
    { status: "cancelled" },
  );
  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to cancel booking");
  }
  return res.data;
}

export type RescheduleBookingPayload = {
  room_id: number;
  check_in: string;
  check_out: string;
  guest_name: string;
  guest_email?: string;
  whatsapp_number: string;
  adults: number;
  children?: number;
  payment_method: "online" | "partial" | "offline";
};

export type RescheduleBookingResponse = {
  success: boolean;
  data: unknown;
  message: string;
};

export async function rescheduleBooking(
  bookingId: string,
  payload: RescheduleBookingPayload,
) {
  const res = await axiosInstance.patch<RescheduleBookingResponse>(
    `/bookings/${bookingId}/reschedule`,
    payload,
  );
  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to update booking");
  }
  return res.data;
}
