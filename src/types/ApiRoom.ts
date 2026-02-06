// src/types/ApiRoom.ts
export type ApiRoom = {
  room_id: number;
  room_name: string | null;
  room_type: string;
  room_number?: number | null;
  total_rooms?: number | null;
  price: string; // decimal comes as string
  room_size?: string | null;
  guests?: number | null;
  image_urls?: string[] | null;
  description?: string | null;
  amenities?: string[] | null;
};
