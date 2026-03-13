"use client"
import { Search, Menu } from "lucide-react";

export default function Header({ onMenuClick, onSearchClick, user }) {
  return (
    <header className="app-header">
      <div className="header-left">
        {/* Hamburger Menu Button */}
        <button 
          type="button" 
          className="menu-btn-icon" 
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Global Search Trigger */}
        <button 
          type="button" 
          className="search-trigger"
          onClick={onSearchClick}
          aria-label="Search tools"
        >
          <Search className="w-4 h-4 text-white/40" />
          <span className="search-text">Search tools...</span>
          <kbd className="search-kbd">⌘K</kbd>
        </button>
      </div>

      <div className="header-center">
        <span className="logo-text">OneTool</span>
      </div>

      <div className="header-actions">
        {user && (
          <div className="user-pill">{user.name || user.email}</div>
        )}
      </div>
    </header>
  );
}
