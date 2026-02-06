import axiosInstance from "../lib/axios-interceptor";

export type ApiCheckIn = {
  booking_id: string;
  check_in: string;
  check_out: string;
  status: string;
  adults: number;
  children: number;

  users: {
    name: string;
  };

  rooms: {
    room_name: string;
  };
};

export type GetTodayCheckInsResponse = {
  success: boolean;
  count: number;
  data: ApiCheckIn[];
};

export async function getTodayCheckIns() {
  const res =
    await axiosInstance.get<GetTodayCheckInsResponse>("/bookings/checkins");

  if (!res.data.success) {
    throw new Error("Failed to fetch today check-ins");
  }

  return res.data;
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const res = await axiosInstance.patch<{
    success: boolean;
    data: unknown;
    message: string;
  }>(`/bookings/${bookingId}/status`, {
    status,
  });

  if (!res.data.success) {
    throw new Error("Failed to update booking status");
  }

  return res.data;
}
