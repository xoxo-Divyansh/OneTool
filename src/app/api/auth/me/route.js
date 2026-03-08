import {
  getAuthenticatedUserId,
  unauthorizedResponse,
} from "@/lib/auth/requireAuth";
import { connectDB } from "@/lib/db/models/connect";
import User from "@/lib/db/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return unauthorizedResponse();
  }

  await connectDB();
  const user = await User.findById(userId).select("-passwordHash");
  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, user });
}
