import axiosInstance from "../lib/axios-interceptor";
import type { DashboardSummary } from "../types/Dashboard";

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const res = await axiosInstance.get("/dashboard/summary");
  return res.data.data;
};
