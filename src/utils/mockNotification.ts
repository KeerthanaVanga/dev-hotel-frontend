// mockNotifications.ts
import type { Notification } from "../types/Notification";

export const notifications: Notification[] = [
  {
    id: 1,
    title: "New booking received",
    description: "Room 204 booked for Dec 25",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    title: "Payment successful",
    description: "₹12,000 received",
    time: "10m ago",
    unread: true,
  },
  {
    id: 3,
    title: "Profile updated",
    description: "Your profile info was updated",
    time: "1h ago",
    unread: false,
  },
];
