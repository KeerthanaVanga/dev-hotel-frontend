import axiosInstance from "../lib/axios-interceptor";

export type ApiPayment = {
  payment_id: string;
  user_id: number;
  booking_id: string;
  method: string;
  status: "pending" | "success" | "partial";
  currency: string;
  bill_amount: string;
  bill_paid_amount: string;
  created_at: string;

  users: {
    user_id: number;
    name: string;
    email: string;
  };

  bookings: {
    booking_id: string;
    check_in: string;
    check_out: string;
    status: string;
  };
};

export type GetPaymentsResponse = {
  success: boolean;
  count: number;
  data: ApiPayment[];
};

export async function getPayments() {
  const res =
    await axiosInstance.get<GetPaymentsResponse>("/payments/payments");

  if (!res.data.success) {
    throw new Error("Failed to fetch payments");
  }

  return res.data;
}

export type UpdatePaymentPayload = {
  bill_paid_amount: number;
  method: "partial_online" | "full_online" | "offline";
  status: "partial_paid" | "paid" | "pending";
};

export type UpdatePaymentResponse = {
  success: boolean;
  data: ApiPayment;
  message: string;
};

export async function updatePayment(
  paymentId: string,
  payload: UpdatePaymentPayload,
) {
  const res = await axiosInstance.patch<UpdatePaymentResponse>(
    `/payments/payments/${paymentId}`,
    payload,
  );
  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to update payment");
  }
  return res.data;
}
