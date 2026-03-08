import { toolCategories } from "@/lib/tools/toolRegistry";

/**
 * Dashboard cards are based on tool categories.
 *
 * This ensures the dashboard stays in sync with the sidebar navigation and
 * tooling roadmap.
 */
export const tools = toolCategories.map((category) => ({
  title: category.label,
  desc: category.description,
  path: category.path,
  icon: category.icon,
}));
