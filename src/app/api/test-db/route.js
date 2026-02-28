export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db/connect";
import User from "@/lib/db/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const count = await User.countDocuments();

    return NextResponse.json({
      success: true,
      users: count,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}