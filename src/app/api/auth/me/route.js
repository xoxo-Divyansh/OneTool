import {
  getAuthenticatedUserId,
  unauthorizedResponse,
} from "@/lib/auth/requireAuth";
import { connectDB } from "@/lib/db/models/connect";
import User from "@/lib/db/models/user.model";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return unauthorizedResponse();
    }

    await connectDB();
    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        {
          status: 404,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        },
      );
    }

    return NextResponse.json(
      { success: true, user },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("[auth/me] Internal server error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  }
}
