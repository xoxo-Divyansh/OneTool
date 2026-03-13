"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

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
      {/* Sidebar - Always visible on desktop, toggle on mobile */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <div className="layout-main">
        {/* Mobile menu button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <main className="layout-content">{children}</main>
      </div>

      {/* Overlay for mobile */}
      <button
        type="button"
        aria-label="Close sidebar"
        className={`sidebar-overlay ${isSidebarOpen ? "visible" : ""}`}
        onClick={closeSidebar}
      />
    </div>
  );
}
