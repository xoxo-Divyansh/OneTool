"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function LayoutShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="layout-root">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="layout-main">
        <Header onMenuClick={toggleSidebar} />
        <main className="layout-content">{children}</main>
      </div>
      <button
        type="button"
        aria-label="Close sidebar"
        className={`sidebar-overlay ${isSidebarOpen ? "visible" : ""}`}
        onClick={closeSidebar}
      />
    </div>
  );
}
