import { Bell, CheckCircle } from "lucide-react";
import type { Notification } from "../../types/Notification";

interface Props {
  notifications: Notification[];
}

const NotificationDropdown = ({ notifications }: Props) => {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div
      className="
        absolute right-0 mt-3 w-80 max-w-[90vw]
        rounded-lg bg-[#241217]
        border border-[#3A1A22]
        shadow-[0_15px_40px_rgba(0,0,0,0.45)]
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#3A1A22]">
        <h3 className="text-sm font-semibold text-[#F5DEB3] tracking-wide">
          Notifications
        </h3>
        <span className="text-xs text-[#D4AF37]">{unreadCount} new</span>
      </div>

      {/* List */}
      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-[#F5DEB3]/60">
            No notifications
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`
                px-4 py-3 border-b border-[#3A1A22]/60 last:border-none
                transition cursor-pointer
                ${
                  n.unread
                    ? "bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10"
                    : "hover:bg-white/5"
                }
              `}
            >
              <div className="flex items-start gap-3">
                <Bell
                  size={16}
                  className={n.unread ? "text-[#D4AF37]" : "text-[#F5DEB3]/40"}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#F5DEB3]">
                    {n.title}
                  </p>
                  <p className="text-xs text-[#F5DEB3]/60">{n.description}</p>
                  <span className="text-[11px] text-[#F5DEB3]/40">
                    {n.time}
                  </span>
                </div>
                {n.unread && (
                  <CheckCircle size={14} className="text-[#D4AF37]" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#3A1A22] text-center">
        <button className="text-sm text-[#D4AF37] hover:underline">
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
