"use client"
export default function Navbar() {
  return (
    <nav className="w-full border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold accent-text">
          OneTool<span className="text-white">.</span>
        </h1>

        <div className="hidden md:flex gap-6 text-sm text-white/80">
          <a href="#" className="hover:text-white transition-colors">Tools</a>
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
        </div>

        <button className="btn-cta-ghost text-sm">
          Get Started
        </button>
      </div>
    </nav>
  );
}
