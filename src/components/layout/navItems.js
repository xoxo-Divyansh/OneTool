/**
 * Sidebar navigation items.
 *
 * We derive this list from the tool registry so adding a new tool or category
 * only requires updating a single source of truth.
 */
import { toolCategories, tools } from "@/core/tool-system/tool-registry";

const workspaceItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    section: "Workspace",
    icon: "DB",
    subtitle: "Overview and quick access",
  },
];

// Build a list of items grouped by category.
// This keeps the sidebar consistent with the categories defined in the registry.
const toolItems = toolCategories.map((category) => ({
  name: category.label,
  path: category.path,
  section: "Tools",
  icon: category.icon || "TO",
  subtitle: category.description,
  // Attach tools so we can render sub-items later if desired.
  tools: tools.filter((tool) => tool.category === category.id),
}));

export const navItems = [...workspaceItems, ...toolItems];
