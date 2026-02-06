import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Settings,
  LogIn,
  CalendarDays,
  BedDouble,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import NotificationDropdown from "../ui/NotificationDropdown";
import { notifications } from "../../utils/mockNotification";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import HotelLogo from "../../assets/ravila-logo.png";

const navLinks = [
  { label: "Check-in", href: "/checkin", icon: LogIn },
  { label: "Check-out", href: "/checkout", icon: LogOut },
  { label: "Calender", href: "/calender", icon: CalendarDays },
  { label: "Inventory", href: "/inventory", icon: BedDouble },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      showToast("success", "Signed out successfully");
      navigate("/auth", { replace: true });
    } catch {
      showToast("error", "Logout failed");
    }
  };

  return (
    <header className="relative z-50 w-full border-b border-[#3A1A22] bg-linear-to-b from-[#1B0F12] to-[#241217]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img
                src={HotelLogo}
                alt="Hotel Logo"
                className="h-9 w-9 rounded-full border border-[#D4AF37] p-1"
              />
              <span className="hidden sm:block text-sm tracking-widest text-[#D4AF37] font-serif">
                GRAND PALACE
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 ml-8">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.label}
                    to={link.href}
                    end
                    className={({ isActive }) =>
                      `
                      flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition
                      ${
                        isActive
                          ? "bg-[#D4AF37]/10 text-[#D4AF37] border-l-2 border-[#D4AF37]"
                          : "text-[#F5DEB3]/70 hover:bg-white/5 hover:text-[#F5DEB3]"
                      }
                      `
                    }
                  >
                    <Icon size={16} />
                    {link.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((s) => !s)}
                className="relative text-[#F5DEB3]/70 hover:text-[#F5DEB3] transition"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 rounded-full bg-[#D4AF37] text-[#1B0F12] text-[11px] flex items-center justify-center font-semibold">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <NotificationDropdown notifications={notifications} />
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((s) => !s)}
                className="flex items-center gap-2 rounded-full hover:bg-white/5 px-2 py-1 transition"
              >
                <img
                  src={HotelLogo}
                  alt="avatar"
                  className="h-8 w-8 rounded-full object-cover border border-[#3A1A22]"
                />
                <ChevronDown size={16} className="text-[#F5DEB3]/70" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 z-50 w-48 rounded-lg bg-[#241217] border border-[#3A1A22] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                  <NavLink
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[#F5DEB3]/80 hover:bg-white/5"
                  >
                    <User size={16} />
                    Your profile
                  </NavLink>
                  <NavLink
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[#F5DEB3]/80 hover:bg-white/5"
                  >
                    <Settings size={16} />
                    Settings
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-white/5"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#F5DEB3]"
              onClick={() => setMobileOpen((s) => !s)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#3A1A22] bg-[#1B0F12]">
          <nav className="flex flex-col px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.label}
                  to={link.href}
                  end
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
                    ${
                      isActive
                        ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                        : "text-[#F5DEB3]/70 hover:bg-white/5"
                    }
                    `
                  }
                >
                  <Icon size={16} />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
