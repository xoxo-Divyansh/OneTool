import { redirect } from "next/navigation";
import { getCategoryById } from "@/core/tool-system/tool-registry";

export default async function ToolCategoryPage({ params }) {
  const resolvedParams = await params;
  const category = getCategoryById(resolvedParams.category);

  if (!category) {
    redirect("/dashboard/tools");
  }

  redirect(category.path);
}
