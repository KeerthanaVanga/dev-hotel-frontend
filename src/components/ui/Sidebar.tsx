import { NavLink, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { sidebarItems, bottomItems } from "../../types/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import HotelLogo from "../../assets/ravila-logo.png";

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ collapsed, onToggle }: Props) => {
  const { logoutUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

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
    <aside
      className={`
        h-screen flex flex-col
        bg-linear-to-b from-[#1B0F12] to-[#241217]
        border-r border-[#3A1A22]
        transition-all duration-300
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      {/* Logo / Toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#3A1A22]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img
              src={HotelLogo}
              alt="Logo"
              className="h-8 w-8 rounded-full border border-[#D4AF37] p-1"
            />
            <span className="text-[#D4AF37] font-serif tracking-widest text-sm">
              GRAND PALACE
            </span>
          </div>
        )}

        <button
          onClick={onToggle}
          className="text-[#F5DEB3]/60 hover:text-[#F5DEB3] transition"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-1">
        {sidebarItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `
              flex items-center gap-3 px-3 py-2 rounded-md text-sm
              transition-all
              ${
                isActive
                  ? "bg-[#D4AF37]/10 text-[#D4AF37] border-l-2 border-[#D4AF37]"
                  : "text-[#F5DEB3]/70 hover:bg-white/5 hover:text-[#F5DEB3]"
              }
            `
            }
          >
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-2 py-4 border-t border-[#3A1A22] space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const key = item.path ?? item.label;

          // 🔴 Logout button
          if (item.label === "Logout") {
            return (
              <button
                key={key}
                onClick={handleLogout}
                className="
                  flex w-full items-center gap-3 px-3 py-2 rounded-md
                  text-sm text-red-400 hover:bg-white/5 transition
                "
              >
                <Icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          }

          // 🟢 Normal bottom links
          return (
            <NavLink
              key={key}
              to={item.path}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-3 py-2 rounded-md text-sm
                transition
                ${
                  isActive
                    ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                    : "text-[#F5DEB3]/70 hover:bg-white/5 hover:text-[#F5DEB3]"
                }
              `
              }
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
