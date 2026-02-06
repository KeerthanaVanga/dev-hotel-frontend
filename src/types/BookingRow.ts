export type BookingRow = {
  id: string;
  room_id: number;
  guestName: string;
  roomType: string;
  roomName: string;
  status: string;
  bookingDate: string; // YYYY-MM-DD
  adults: number;
  children: number;
  nights: number;
  fromDate: string; // YYYY-MM-DD
  toDate: string; // YYYY-MM-DD
};
