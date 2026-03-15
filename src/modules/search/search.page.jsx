import { toolCategories, tools } from "@/core/tool-system/tool-registry";
import SearchLanding from "@/modules/search/search.ui";

export default function SearchPage() {
  const toolIndex = tools.map((tool) => ({
    id: tool.id,
    name: tool.name,
    category: tool.category,
    description: tool.description,
    icon: tool.icon,
    comingSoon: tool.comingSoon,
    keywords: tool.keywords ?? [],
    path: tool.path,
    requiresAuth: Boolean(tool.requiresAuth),
  }));

  const categories = toolCategories.map((category) => ({
    id: category.id,
    label: category.label,
    description: category.description,
  }));

  const featuredTools = toolIndex
    .filter((tool) => !tool.comingSoon)
    .slice(0, 6);

  return (
    <SearchLanding
      tools={toolIndex}
      categories={categories}
      featuredTools={featuredTools}
    />
  );
}
