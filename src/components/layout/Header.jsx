"use client"
export default function Header({ onMenuClick }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <button type="button" className="menu-btn" onClick={onMenuClick}>
          Menu
        </button>
        <input className="search-input" placeholder="Search tools..." />
      </div>

      <div className="header-actions">
        <button type="button" className="cmd-btn">
          Ctrl + K
        </button>
        <div className="user-pill">Divyansh</div>
      </div>
    </header>
  );
}
