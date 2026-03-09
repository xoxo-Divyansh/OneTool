import { getToolRunner } from "@/core/tool-system/tool-runner-registry";

async function executeToolLocally(toolId, input, options = {}) {
  const run = getToolRunner(toolId);

  if (!run) {
    return { ok: false, error: `Tool not found: ${toolId}` };
  }

  try {
    const result = await run(input, options);

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

async function executeToolViaApi(toolId, input, options = {}) {
  try {
    const response = await fetch(`/api/tools/${encodeURIComponent(toolId)}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ input, options }),
    });
    const payload = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        error: payload?.result?.error || payload?.message || "Tool API request failed",
        status: response.status,
      };
    }

    return payload?.result ?? { ok: false, error: "Invalid tool API response" };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Tool API request failed",
    };
  }
}

export async function executeTool(toolId, input, options = {}) {
  if (typeof window !== "undefined") {
    return executeToolViaApi(toolId, input, options);
  }

  return executeToolLocally(toolId, input, options);
}
