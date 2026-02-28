"use client"

import Link from "next/link";

export default function ToolCard({ icon, title, desc, path = "#" }) {
  return (
    <Link href={path} className="tool-card-link">
      <div className="tool-card">
        {icon ? <span className="tool-icon">{icon}</span> : null}
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </Link>
  );
}
