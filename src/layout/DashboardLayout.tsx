import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import Navbar from "../components/ui/Navbar";
import Breadcrumbs from "../components/ui/Breadcrumbs";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#1B0F12]">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((s) => !s)} />

      {/* Main */}
      <div className="flex flex-col flex-1">
        <Navbar />

        {/* Page Wrapper */}
        <main className="flex-1 overflow-auto bg-[#1F1216] p-6 text-[#F5DEB3] space-y-6">
          <Breadcrumbs />

          {/* Page Content */}
          <div className="pt-2">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
