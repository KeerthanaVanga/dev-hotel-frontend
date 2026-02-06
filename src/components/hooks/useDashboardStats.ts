// src/hooks/useDashboardStats.ts
import { useEffect, useState } from "react";

export interface DashboardStats {
  users: number;
  checkInsToday: number;
  checkOutsToday: number;
  onlineEarnings: number;
  offlineEarnings: number;
}

export const useDashboardStats = () => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with real API
    setTimeout(() => {
      setData({
        users: 128,
        checkInsToday: 14,
        checkOutsToday: 9,
        onlineEarnings: 42500,
        offlineEarnings: 27800,
      });
      setLoading(false);
    }, 1200);
  }, []);

  return { data, loading };
};
