import axiosInstance from "../lib/axios-interceptor";

export type ApiCheckOut = {
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

export type GetTodayCheckOutsResponse = {
  success: boolean;
  count: number;
  data: ApiCheckOut[];
};

export async function getTodayCheckOuts() {
  const res = await axiosInstance.get<GetTodayCheckOutsResponse>(
    "/bookings/checkouts",
  );

  if (!res.data.success) {
    throw new Error("Failed to fetch today check-outs");
  }

  return res.data;
}
