// src/types/Offer.ts
export type Offer = {
  offer_id: number;
  room_id: number;
  title: string;
  discount_percent: number;
  offer_price: string | null; // Decimal comes as string
  start_date: string | null;
  end_date: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
  rooms?: {
    room_id: number;
    room_name: string | null;
    room_type: string;
    price: string; // Decimal -> string
  };
};

export type OfferPayload = {
  room_id: number;
  discount_percent: number;
  offer_price?: number | string | null; // optional; when set, used as the offer price per night
  start_date?: string | null; // "YYYY-MM-DD"
  end_date?: string | null; // "YYYY-MM-DD"
  is_active?: boolean;
};
