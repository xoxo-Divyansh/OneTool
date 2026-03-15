import { NextResponse } from "next/server";
import { getAuthenticatedUserId, unauthorizedResponse } from "@/lib/auth/requireAuth";
import { executeTool } from "@/core/tool-system/tool-engine";
import { getToolById } from "@/core/tool-system/tool-registry";

export async function POST(req, { params }) {
  const resolvedParams = await params;
  const toolId = resolvedParams?.toolId;
  const tool = getToolById(toolId);

  if (!tool) {
    return NextResponse.json(
      {
        result: {
          ok: false,
          error: "Tool not found",
        },
      },
      { status: 404 },
    );
  }

  if (tool.requiresAuth !== false) {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return unauthorizedResponse();
    }
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      {
        result: {
          ok: false,
          error: "Invalid JSON payload",
        },
      },
      { status: 400 },
    );
  }

  const result = await executeTool(toolId, payload?.input, payload?.options);

  return NextResponse.json({ result }, { status: result.ok ? 200 : 400 });
}
