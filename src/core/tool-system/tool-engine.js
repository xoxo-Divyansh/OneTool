import { getToolById } from "@/core/tool-system/tool-registry";

export async function executeTool(toolId, input, options = {}) {
  const tool = getToolById(toolId);

  if (!tool) {
    return { ok: false, error: `Tool not found: ${toolId}` };
  }

  if (typeof tool.run !== "function") {
    return { ok: false, error: `Tool does not implement run(): ${toolId}` };
  }

  try {
    const result = await tool.run(input, options);

    if (result && typeof result === "object" && "ok" in result) {
      return result;
    }

    return { ok: true, result };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Tool execution failed",
    };
  }
}

