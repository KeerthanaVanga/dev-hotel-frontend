export type CheckOutStatus = "checked-out" | "today" | "overstayed";

export interface CheckOut {
  id: string;
  guestName: string;
  roomType: string;
  status: CheckOutStatus;
  bookingDate: string;
  adults: number;
  children: number;
  nights: number;
  fromDate: string;
  toDate: string;
}
