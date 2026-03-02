"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    setLoading(true);
    setError("");

    try {
      await register({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      });
      router.replace("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex justify-center">
        <span className="text-5xl" aria-hidden="true">??</span>
      </div>

      <h2 className="text-center text-2xl font-bold text-white tracking-wide">
        Create account
      </h2>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <input
        name="name"
        placeholder="Full name"
        required
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 transition"
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 transition"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 transition"
      />

      <button
        disabled={loading}
        className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-50"
      >
        {loading ? "Creating..." : "Register"}
      </button>

      <p className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-purple-400 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
