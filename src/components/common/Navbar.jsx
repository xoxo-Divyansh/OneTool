"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import ToolSearch from "@/components/common/ToolSearch";

export default function Navbar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't show CTA if already on dashboard
  const showCTA = !pathname.startsWith("/dashboard");
  const ctaHref = user ? "/dashboard" : "/auth/register";
  const ctaLabel = user ? "Dashboard" : "Get Started";

  return (
    <>
      {/* Minimal Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-10 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left Side: Search + Menu */}
            <div className="flex items-center gap-3">
              {/* Desktop: Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm group"
              >
                <Search className="w-4 h-4 text-white/50 group-hover:text-white/70" />
                <span className="text-white/50 group-hover:text-white/70">Search tools...</span>
                <kbd className="ml-2 px-2 py-0.5 text-xs text-white/40 border border-white/10 rounded bg-white/5">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile: Search + Menu Buttons */}
              <div className="flex md:hidden items-center gap-2">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 text-white/60" />
                </button>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label="Menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5 text-white/60" />
                  ) : (
                    <Menu className="w-5 h-5 text-white/60" />
                  )}
                </button>
              </div>
            </div>

            {/* Right Side: Logo + CTA */}
            <div className="flex items-center gap-3">
              <Link href="/" className="text-lg font-bold accent-text flex-shrink-0">
                OneTool<span className="text-white">.</span>
              </Link>

              {/* Desktop: CTA */}
              {showCTA && (
                <Link
                  href={loading ? "#" : ctaHref}
                  className={`hidden md:inline-flex px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors ${loading ? "opacity-60 pointer-events-none" : ""}`}
                >
                  {loading ? "Loading..." : ctaLabel}
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <div className="flex flex-col gap-2">
                <Link
                  href="/tools"
                  className="px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tools
                </Link>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {showCTA && (
                  <Link
                    href={ctaHref}
                    className="mt-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium text-center transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {ctaLabel}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-16" />

      {/* Global Tool Search Modal */}
      <ToolSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
