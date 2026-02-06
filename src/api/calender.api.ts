// src/api/calendar.api.ts
import axiosInstance from "../lib/axios-interceptor";

export type ApiCalendarBooking = {
  booking_id: number;
  check_in: string; // ISO
  check_out: string; // ISO
  status: string;
  users: { name: string };
  rooms: { room_name: string; room_type: string };
};

export type CalendarBookingsResponse = {
  success: boolean;
  count: number;
  data: ApiCalendarBooking[];
};

/**
 * Fetch bookings between [from, to] (inclusive)
 * Backend route example: GET /bookings/calendar?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
export async function getCalendarBookings(params: {
  from: string;
  to: string;
}) {
  const res = await axiosInstance.get<CalendarBookingsResponse>(
    "/bookings/upcoming",
    { params },
  );
  return res.data;
}
