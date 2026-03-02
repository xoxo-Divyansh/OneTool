import { signToken } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/db/connect";
import User from "@/lib/db/models/user.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );
  }

  const match = await bcrypt.compare(password, user.passwordHash);

  if (!match) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );
  }

  const accessToken = signToken({ id: user._id });
  const refreshToken = signToken({ id: user._id }, "7d");

  user.lastLoginAt = new Date();
  await user.save();

  const res = NextResponse.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  };

  res.cookies.set("accessToken", accessToken, cookieOptions);
  res.cookies.set("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
