import { notFound } from "next/navigation";
import { getToolByRoute } from "@/core/tool-system/tool-registry";

export default async function ToolRuntimePage({ params }) {
  const resolvedParams = await params;
  const tool = getToolByRoute(resolvedParams.category, resolvedParams.tool);

  if (!tool) {
    notFound();
  }

  const ToolComponent = tool.component;

  return <ToolComponent />;
}
