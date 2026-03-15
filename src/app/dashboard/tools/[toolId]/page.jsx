import { notFound } from "next/navigation";
import { getToolById } from "@/core/tool-system/tool-registry";

export default async function DashboardToolPage({ params }) {
  const resolvedParams = await params;
  const tool = getToolById(resolvedParams?.toolId);

  if (!tool) {
    notFound();
  }

  const ToolComponent = tool.component;

  return <ToolComponent />;
}
