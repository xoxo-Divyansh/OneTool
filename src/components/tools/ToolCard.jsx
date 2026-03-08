import Link from "next/link";

export default function ToolCard({ tool }) {
  const statusLabel = tool.comingSoon ? "Coming soon" : "Open tool";

  return (
    <Link
      href={tool.path}
      className="tool-card-link block rounded-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0c]"
    >
      <article className="feature-card h-full transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400/60">
        <span className="feature-card-icon">{tool.icon}</span>
        <div className="feature-card-body">
          <h3 className="feature-card-title">{tool.name}</h3>
          <p className="feature-card-desc">{tool.description}</p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-emerald-300/90">
          {statusLabel}
        </span>
      </article>
    </Link>
  );
}

