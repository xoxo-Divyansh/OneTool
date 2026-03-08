"use client"
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, loading } = useAuth();
  const ctaHref = user ? "/dashboard" : "/auth/register";
  const ctaLabel = user ? "Open Dashboard" : "Get Started";

  return (
    <nav className="w-full border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold accent-text">
          OneTool<span className="text-white">.</span>
        </h1>

        <div className="hidden md:flex gap-6 text-sm text-white/80 ">
          <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
          <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        </div>

        <Link
          href={ctaHref}
          className="btn-cta-ghost text-sm"
          aria-disabled={loading}
        >
          {ctaLabel}
        </Link>
      </div>
    </nav>
  );
}
