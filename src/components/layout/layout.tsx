import { useState } from "react";
import Sidebar from "./sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex w-screen h-screen bg-white">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className="flex-1 flex flex-col bg-gray-50">{children}</main>
    </div>
  );
}
