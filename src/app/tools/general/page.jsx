import ToolCard from "@/components/tools/ToolCard";
import { getToolsByCategory } from "@/lib/tools/toolRegistry";

export default function GeneralToolsPage() {
  const categoryTools = getToolsByCategory("general");

  return (
    <section className="dashboard">
      <div className="dashboard-intro bento-large">
        <p className="dashboard-kicker">General Tools</p>
        <h1>General utility tools</h1>
        <p className="dashboard-subtitle">
          Practical tools for common file and content workflows.
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

