import { NextResponse } from "next/server";
import { executeTool } from "@/core/tool-system/tool-engine";

export async function POST(req, { params }) {
  const resolvedParams = await params;
  const toolId = resolvedParams?.toolId;

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

