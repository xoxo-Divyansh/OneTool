"use client"
import Link from "next/link";
import { navItems } from "@/components/layout/navItems";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="logo">OneTool</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="nav-link"
            onClick={onClose}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
