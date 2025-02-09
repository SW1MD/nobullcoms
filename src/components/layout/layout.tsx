import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

export default function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex w-screen h-screen bg-white">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className="flex-1 flex flex-col bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
