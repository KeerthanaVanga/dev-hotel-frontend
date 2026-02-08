import axiosInstance from "../lib/axios-interceptor";

/* ---------------- Types ---------------- */

export type PaymentStatusItem = {
  status: string;
  count: number;
  totalBillAmount: number;
  paidAmount: number;
  pendingAmount: number;
};

export type ReportsResponse = {
  kpis: {
    totalRevenue: number;
    revenueToday: number;
    totalBookings: number;
    occupancy: number;
    adr: number;
    revpar: number;
  };
  charts: {
    revenueTrend: {
      date: string;
      revenue: number;
    }[];
    revenueByRoom: {
      room_name: string;
      revenue: number;
    }[];
    paymentStatus: PaymentStatusItem[];
  };
};

/* ---------------- API Call ---------------- */

export const getReportsSummary = async (params?: {
  from?: string;
  to?: string;
}): Promise<ReportsResponse> => {
  const res = await axiosInstance.get<{
    success: boolean;
    data: ReportsResponse;
  }>("/reports/summary", {
    params,
  });

  return res.data.data;
};
