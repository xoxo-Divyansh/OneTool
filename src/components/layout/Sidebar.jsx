"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/layout/navItems";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname() || "";

  const groupedItems = navItems.reduce((acc, item) => {
    const group = item.section || "Tools";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand-mark">OT</div>
        <div>
          <div className="logo">OneTool</div>
          <p className="sidebar-brand-subtitle">Developer workspace</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {Object.entries(groupedItems).map(([sectionName, items]) => (
          <div key={sectionName} className="sidebar-section">
            <p className="sidebar-section-title">{sectionName}</p>
            {items.map((item) => {
              const isActive =
                pathname === item.path || pathname.startsWith(`${item.path}/`);

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
    </aside>
  );
}
