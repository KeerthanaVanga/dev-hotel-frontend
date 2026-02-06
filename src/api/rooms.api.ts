import axiosInstance from "../lib/axios-interceptor";

/* ---------- API TYPES ---------- */

export type ApiRoom = {
  room_id: number;
  room_name: string;
  room_type: string;
  room_number: number;
  rooms_available: number;
  price: string;
  description: string;
  image_urls: string[];
  total_rooms: number;
  booked_rooms: number;
  guests: number;
  room_size: string;
  amenities: string[];
};

export type GetRoomsResponse = {
  success: boolean;
  count: number;
  data: ApiRoom[];
};

/* ---------- API CALLS ---------- */

export async function getRooms() {
  const res = await axiosInstance.get<GetRoomsResponse>("/rooms/rooms");

  if (!res.data.success) {
    throw new Error("Failed to fetch rooms");
  }

  return res.data;
}

export async function getRoomById(roomId: string) {
  const res = await axiosInstance.get<GetRoomsResponse>(`/rooms/rooms`);

  if (!res.data.success) {
    throw new Error("Failed to fetch room");
  }

  const room = res.data.data.find((r) => String(r.room_id) === roomId);

  if (!room) {
    throw new Error("Room not found");
  }

  return room;
}

export async function createRoom(payload: FormData) {
  const res = await axiosInstance.post("/rooms/rooms", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!res.data.success) throw new Error("Failed to create room");
  return res.data;
}

export async function updateRoom(roomId: string, payload: FormData) {
  const res = await axiosInstance.put(`/rooms/rooms/${roomId}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!res.data.success) throw new Error("Failed to update room");
  return res.data;
}
