import { loadToolConfigs } from "@/core/tool-system/tool-loader";

const categoryMeta = {
  general: {
    label: "General Tools",
    description: "Everyday utilities for files, media, and quick tasks.",
    icon: "GN",
  },
  developer: {
    label: "Developer Tools",
    description: "Code-focused helpers for faster debugging and formatting.",
    icon: "DE",
  },
  student: {
    label: "Student Tools",
    description: "Study and productivity helpers for daily learning workflows.",
    icon: "ST",
  },
};

function buildCategoryConfig(categoryId) {
  const fallbackLabel = categoryId
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const meta = categoryMeta[categoryId] ?? {
    label: fallbackLabel,
    description: `${fallbackLabel} in OneTool.`,
    icon: "TO",
  };

  return {
    id: categoryId,
    label: meta.label,
    description: meta.description,
    path: `/tools/${categoryId}`,
    icon: meta.icon,
  };
}

const loadedTools = loadToolConfigs();

export const tools = loadedTools.map((tool) => ({
  ...tool,
  slug: tool.id,
  path: `/tools/${tool.category}/${tool.id}`,
}));

export const toolCategories = Array.from(new Set(tools.map((tool) => tool.category))).map((categoryId) =>
  buildCategoryConfig(categoryId),
);

export function getCategoryById(categoryId) {
  return toolCategories.find((category) => category.id === categoryId);
}

export function getToolsByCategory(categoryId) {
  return tools.filter((tool) => tool.category === categoryId);
}

export function getToolByRoute(categoryId, toolId) {
  return tools.find((tool) => tool.category === categoryId && tool.id === toolId);
}

