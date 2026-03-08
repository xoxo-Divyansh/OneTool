import ToolCard from "@/components/tools/ToolCard";
import { getToolsByCategory } from "@/lib/tools/toolRegistry";

export default function DeveloperToolsPage() {
  const categoryTools = getToolsByCategory("developer");

  return (
    <section className="dashboard">
      <div className="dashboard-intro bento-large">
        <p className="dashboard-kicker">Developer Tools</p>
        <h1>Developer utility tools</h1>
        <p className="dashboard-subtitle">
          Fast formatting and debugging helpers for coding workflows.
        </p>
      </div>

      <div className="feature-grid">
        {categoryTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}

