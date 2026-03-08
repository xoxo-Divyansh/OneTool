"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ToolCard from "@/components/tools/ToolCard";
import { toolCategories, tools } from "@/lib/tools/toolRegistry";

export default function ToolsDashboardPage() {
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();

  const groupedTools = useMemo(() => {
    return toolCategories.map((category) => {
      const categoryTools = tools.filter((tool) => tool.category === category.id);
      const filteredTools = search
        ? categoryTools.filter(
            (tool) =>
              tool.name.toLowerCase().includes(search) ||
              tool.description.toLowerCase().includes(search),
          )
        : categoryTools;

      return {
        ...category,
        tools: filteredTools,
      };
    });
  }, [search]);

  return (
    <section className="dashboard">
      <div className="dashboard-intro bento-large">
        <p className="dashboard-kicker">OneTool Dashboard</p>
        <h1>Browse tools by category</h1>
        <p className="dashboard-subtitle">
          Start with a small set of useful tools, then scale category by category.
        </p>
      </div>

      <div className="dashboard-panel">
        <label htmlFor="tool-search" className="block text-sm text-slate-300 mb-2">
          Search Tools
        </label>
        <input
          id="tool-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools..."
          className="search-input w-full"
        />
      </div>

      {groupedTools.map((category) => (
        <div key={category.id} className="dashboard-panel">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-semibold m-0">{category.label}</h2>
              <p className="dashboard-subtitle">{category.description}</p>
            </div>
            <Link href={category.path} className="btn-cta-ghost">
              View category
            </Link>
          </div>

          {category.tools.length > 0 ? (
            <div className="feature-grid">
              {category.tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          ) : (
            <p className="dashboard-subtitle">No matching tools in this category.</p>
          )}
        </div>
      ))}
    </section>
  );
}

