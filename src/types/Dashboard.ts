export type BookingStatusItem = {
  status: string;
  count: number;
};

export type HourlyBookingPoint = {
  hour: string; // "09:00 AM"
  count: number;
};

export type DashboardSummary = {
  kpis: {
    totalUsers: number;
    newUsersToday: number;
    todayBookings: number;
    todayCheckIn: number;
    todayCheckOut: number;
    upcomingBookings: number;
    todayRevenue: number;
  };
  charts: {
    bookingStatus: BookingStatusItem[];
    hourlyBookings: HourlyBookingPoint[];
  };
};
