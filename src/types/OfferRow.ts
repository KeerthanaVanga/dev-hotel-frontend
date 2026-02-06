// src/types/OfferRow.ts
export type OfferRow = {
  id: string;
  roomName: string;
  roomType: string;
  title: string;
  originalPrice: string; // from rooms.price
  discountPercent: number;
  offerPrice: string; // computed from DB
  active: boolean;
  startDate: string;
  endDate: string;
};
