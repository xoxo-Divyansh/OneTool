import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import User from "@/lib/db/models/user.model";
import { signToken } from "@/lib/auth/jwt";
import { setAuthCookies } from "@/lib/auth/cookies";

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Missing fields" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const match = await bcrypt.compare(password, user.passwordHash);

  if (!match) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const accessToken = signToken({ id: user._id });
  const refreshToken = signToken({ id: user._id }, "7d");

  setAuthCookies(accessToken, refreshToken);

  user.lastLoginAt = new Date();
  await user.save();

  return NextResponse.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
}