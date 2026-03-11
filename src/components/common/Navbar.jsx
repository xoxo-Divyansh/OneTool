"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, loading } = useAuth();
  const ctaHref = user ? "/dashboard" : "/auth/register";
  const ctaLabel = user ? "Open Dashboard" : "Get Started";
  const pathname = usePathname();
  const isTools = pathname.startsWith("/tools");
  const isDashboard = pathname.startsWith("/dashboard");
  const [isFeaturesInView, setIsFeaturesInView] = useState(false);
  const isFeaturesActive = pathname === "/" && isFeaturesInView;

  useEffect(() => {
    if (pathname !== "/") return;

    const section = document.getElementById("features");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFeaturesInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "-10% 0px -65% 0px",
        threshold: 0.1,
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <nav className="w-full border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold accent-text">
          OneTool<span className="text-white">.</span>
        </Link>

        <div className="hidden md:flex gap-6 text-sm text-white/80 ">
          <div className="relative group">
            <Link
              href="/tools"
              className={`hover:text-white transition-colors ${
                isTools ? "text-white font-medium" : "text-white/80"
              }`}
            >
              Tools
            </Link>
            <div className="pointer-events-none absolute left-0 top-full z-30 mt-3 w-56 translate-y-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <div className="rounded-xl border border-white/10 bg-black/90 p-3 shadow-[0_12px_32px_rgba(0,0,0,0.45)] backdrop-blur">
                <Link
                  href="/tools/general"
                  className="block rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:text-white hover:bg-white/5"
                >
                  General Tools
                </Link>
                <Link
                  href="/tools/developer"
                  className="block rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:text-white hover:bg-white/5"
                >
                  Developer Tools
                </Link>
                <Link
                  href="/tools/student"
                  className="block rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:text-white hover:bg-white/5"
                >
                  Student Tools
                </Link>
                <Link
                  href="/tools"
                  className="mt-2 block rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-300/90 transition-colors hover:text-emerald-200 hover:bg-emerald-500/10"
                >
                  View All Tools
                </Link>
              </div>
            </div>
          </div>
          <Link
            href="/#features"
            className={`hover:text-white transition-colors ${
              isFeaturesActive ? "text-white font-medium" : "text-white/80"
            }`}
          >
            Features
          </Link>
          <Link
            href="/dashboard"
            className={`hover:text-white transition-colors ${
              isDashboard ? "text-white font-medium" : "text-white/80"
            }`}
          >
            Dashboard
          </Link>
        </div>

        <Link
          href={loading ? "#" : ctaHref}
          className={`btn-cta-ghost text-sm ${loading ? "opacity-60 pointer-events-none" : ""}`}
        >
          {loading ? "Loading..." : ctaLabel}
        </Link>
      </div>
    </nav>
  );
}
