// components/layout/sidebar.config.ts
import {
  LayoutDashboard,
  Users,
  BedDouble,
  CalendarCheck,
  CreditCard,
  Star,
  MessageCircle,
  BarChart3,
  Percent,
  Settings,
  LogOut,
} from "lucide-react";

/**
 * MAIN NAVIGATION
 */
export const sidebarItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },

  {
    label: "Users",
    icon: Users,
    path: "/users",
  },

  {
    label: "Rooms",
    icon: BedDouble,
    path: "/rooms",
  },
  {
    label: "Offers",
    icon: Percent,
    path: "/offers",
  },
  {
    label: "Bookings",
    icon: CalendarCheck,
    path: "/bookings",
  },

  {
    label: "Payments",
    icon: CreditCard,
    path: "/payments",
  },

  {
    label: "Reviews",
    icon: Star,
    path: "/reviews",
  },

  {
    label: "WhatsApp Bot",
    icon: MessageCircle,
    path: "/whatsapp",
  },

  {
    label: "Reports & Revenue",
    icon: BarChart3,
    path: "/reports",
  },
];

/**
 * BOTTOM ACTIONS
 */
export const bottomItems = [
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
  {
    label: "Logout",
    icon: LogOut,
    path: "/logout",
  },
];
