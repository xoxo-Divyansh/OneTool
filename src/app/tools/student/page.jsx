import ToolCard from "@/components/tools/ToolCard";
import { getToolsByCategory } from "@/lib/tools/toolRegistry";

export default function StudentToolsPage() {
  const categoryTools = getToolsByCategory("student");

  return (
    <section className="dashboard">
      <div className="dashboard-intro bento-large">
        <p className="dashboard-kicker">Student Tools</p>
        <h1>Student utility tools</h1>
        <p className="dashboard-subtitle">
          Build and scale tools for focus, notes, and study workflows.
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

