import { signToken } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/db/models/connect";
import User from "@/lib/db/models/user.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  const { name, email, password } = await req.json();
  const normalizedName = String(name || "").trim();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPassword = String(password || "");

  if (!normalizedName || !normalizedEmail || !normalizedPassword) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const existing = await User.findOne({ email: normalizedEmail });

  if (existing) {
    return NextResponse.json(
      { message: "Email already registered" },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(normalizedPassword, 12);

  const user = await User.create({
    name: normalizedName,
    email: normalizedEmail,
    passwordHash,
  });

  const accessToken = signToken({ id: user._id });
  const refreshToken = signToken({ id: user._id }, "7d");

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
