import { notFound } from "next/navigation";
import ToolCard from "@/components/tools/ToolCard";
import { getCategoryById, getToolsByCategory } from "@/core/tool-system/tool-registry";

export default async function ToolCategoryPage({ params }) {
  const resolvedParams = await params;
  const category = getCategoryById(resolvedParams.category);

  if (!category) {
    notFound();
  }

  const categoryTools = getToolsByCategory(category.id);

  return (
    <section className="dashboard">
      <div className="dashboard-intro bento-large">
        <p className="dashboard-kicker">{category.label}</p>
        <h1>{category.label}</h1>
        <p className="dashboard-subtitle">{category.description}</p>
      </div>

      <div className="feature-grid">
        {categoryTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
