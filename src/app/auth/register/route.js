import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import User from "@/lib/db/models/user.model";
import { signToken } from "@/lib/auth/jwt";
import { setAuthCookies } from "@/lib/auth/cookies";

export async function POST(req) {
  await connectDB();

  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "Missing fields" },
      { status: 400 }
    );
  }

  const existing = await User.findOne({ email });

  if (existing) {
    return NextResponse.json(
      { message: "Email already registered" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    passwordHash,
  });

  const accessToken = signToken({ id: user._id });
  const refreshToken = signToken({ id: user._id }, "7d");

  setAuthCookies(accessToken, refreshToken);

  return NextResponse.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
}