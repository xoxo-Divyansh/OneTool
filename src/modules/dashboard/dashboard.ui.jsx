import ToolCard from "@/components/dashboard/ToolCard";

export default function DashboardUI({ tools }) {
  return (
    <section className="dashboard">
      <div className="dashboard-intro bento-large">
        <p className="dashboard-kicker">Workspace</p>
        <h1>Welcome back</h1>
        <p className="dashboard-subtitle">
          Access your most-used utilities and track recent activity from one
          place.
        </p>
      </div>

      <div className="dashboard-grid">
        {tools.map((tool) => (
          <ToolCard key={tool.title} {...tool} />
        ))}

        <article className="dashboard-panel bento-wide">
          <h2>Quick Insights</h2>
          <p>3 tools configured, 2 recent sessions, 99.9% uptime this week.</p>
        </article>
      </div>
    </section>
  );
}
