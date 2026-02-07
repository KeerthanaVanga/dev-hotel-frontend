export type PaymentMethodOption = "partial_online" | "full_online" | "offline";
export type PaymentStatusOption = "partial_paid" | "paid" | "pending";

export type Payment = {
  id: string;
  userName: string;
  bookingDate: string;
  paymentDate: string;
  roomType: string;
  nights: number;
  perNightPrice: number;
  billGenerated: number;
  billPaid: number;
  /** Remaining to pay = billGenerated - billPaid */
  remainingToPay: number;
  paymentMethod: string;
  status: string;
};
