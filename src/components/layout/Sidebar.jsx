"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "@/components/layout/navItems";
import ToolSearch from "@/components/common/ToolSearch";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname() || "";
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const groupedItems = navItems.reduce((acc, item) => {
    const group = item.section || "Tools";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        {/* Sidebar Header with Logo */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-mark">OT</div>
            <div>
              <div className="logo">OneTool</div>
              <p className="sidebar-brand-subtitle">Developer workspace</p>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button 
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Trigger */}
        <div className="sidebar-search">
          <button 
            className="sidebar-search-btn"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-4 h-4" />
            <span>Search tools...</span>
            <kbd className="sidebar-search-kbd">Cmd+K</kbd>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {Object.entries(groupedItems).map(([sectionName, items]) => (
            <div key={sectionName} className="sidebar-section">
              <p className="sidebar-section-title">{sectionName}</p>
              {items.map((item) => {
                const basePath = item.path.split("?")[0];
                const isActive =
                  pathname === basePath || pathname.startsWith(`${basePath}/`);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`nav-link ${isActive ? "active" : ""}`}
                    onClick={onClose}
                  >
                    <span className="nav-link-icon">{item.icon}</span>
                    <span className="nav-link-copy">
                      <span className="nav-link-title">{item.name}</span>
                      <span className="nav-link-subtitle">{item.subtitle}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Info at Bottom */}
        {user && (
          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">
                {(user.name || user.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{user.name || "User"}</div>
                <div className="sidebar-user-email">{user.email}</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Global Tool Search Modal */}
      <ToolSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
