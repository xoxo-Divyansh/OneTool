import {
  getAuthenticatedUserId,
  unauthorizedResponse,
} from "@/lib/auth/requireAuth";
import { connectDB } from "@/lib/db/models/connect";
import ToolHistory from "@/lib/db/models/toolHistory.model";
import { NextResponse } from "next/server";

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
}

export async function GET(req) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return unauthorizedResponse();
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = parsePositiveInt(searchParams.get("page"), 1);
  const pageSize = Math.min(
    parsePositiveInt(searchParams.get("pageSize"), 10),
    50,
  );
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    ToolHistory.find({ userId, tool: "api-tester" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    ToolHistory.countDocuments({ userId, tool: "api-tester" }),
  ]);

  return NextResponse.json({
    success: true,
    items: items.map((entry) => ({
      id: entry._id.toString(),
      title: entry.title,
      request: entry.input,
      response: entry.output,
      meta: entry.meta,
      createdAt: entry.createdAt,
    })),
    page,
    pageSize,
    total,
    hasMore: skip + items.length < total,
  });
}
