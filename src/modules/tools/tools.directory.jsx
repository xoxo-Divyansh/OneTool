"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import ToolCard from "@/components/tools/ToolCard";
import { toolCategories, tools } from "@/core/tool-system/tool-registry";

export default function ToolsDirectory({
  heading = "Browse tools",
  subtitle = "Start with a small set of useful tools, then scale category by category.",
}) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const groupedTools = useMemo(() => {
    const categories = activeCategory
      ? toolCategories.filter((category) => category.id === activeCategory)
      : toolCategories;

    return categories.map((category) => {
      const categoryTools = tools.filter((tool) => tool.category === category.id);

      return {
        ...category,
        tools: categoryTools,
      };
    });
  }, [activeCategory]);

  return (
    <section className="dashboard">
      <div className="dashboard-intro bento-large">
        <p className="dashboard-kicker">OneTool Directory</p>
        <h1>{heading}</h1>
        <p className="dashboard-subtitle">{subtitle}</p>
      </div>

      <div className="dashboard-panel bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border-emerald-500/30">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-emerald-200 font-medium mb-1">
              Quick Tool Search
            </p>
            <p className="text-xs text-emerald-300/70">
              Press <kbd className="px-2 py-1 text-xs border border-emerald-400/30 rounded bg-emerald-500/10 text-emerald-300">Cmd+K</kbd> or <kbd className="px-2 py-1 text-xs border border-emerald-400/30 rounded bg-emerald-500/10 text-emerald-300">Ctrl+K</kbd> to search all tools instantly
            </p>
          </div>
        </div>
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
            <p className="dashboard-subtitle">No tools in this category yet.</p>
          )}
        </div>
      ))}
    </section>
  );
}
