import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/models/connect";
import User from "@/lib/db/models/user.model";
import { signToken } from "@/lib/auth/jwt";

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPassword = String(password || "");

  if (!normalizedEmail || !normalizedPassword) {
    return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
  }

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const hash = user.passwordHash || user.password;
  if (!hash || typeof hash !== "string") {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  let match = false;
  const looksLikeBcryptHash = hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$");

  if (looksLikeBcryptHash) {
    try {
      match = await bcrypt.compare(normalizedPassword, hash);
    } catch {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
  } else {
    // Backward compatibility for legacy users with plain-text password storage.
    match = normalizedPassword === hash;
    if (match) {
      const migratedHash = await bcrypt.hash(normalizedPassword, 12);
      await User.updateOne(
        { _id: user._id },
        { $set: { passwordHash: migratedHash }, $unset: { password: 1 } },
      );
    }
  }

  if (!match) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const accessToken = signToken({ id: user._id });
  const refreshToken = signToken({ id: user._id }, "7d");

  const res = NextResponse.json({
    success: true,
    message: "Login successful",
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
