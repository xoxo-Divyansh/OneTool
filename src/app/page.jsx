import Navbar from "@/components/common/Navbar";
import Link from "next/link";
import ToolCard from "@/components/ToolCard";

const popularTools = [
  {
    icon: "image",
    title: "Image Compressor",
    desc: "Compress images without losing quality",
    path: "/tools/general/image-compressor",
  },
  {
    icon: "JS",
    title: "JSON Formatter",
    desc: "Beautify and validate JSON quickly",
    path: "/tools/developer/json-formatter",
  },
  {
    icon: "AP",
    title: "API Tester",
    desc: "Send requests and inspect API responses",
    path: "/tools/developer/api-tester",
  },
  {
    icon: "GN",
    title: "General Tools",
    desc: "Open all currently available general tools",
    path: "/tools/general",
  },
  {
    icon: "DE",
    title: "Developer Tools",
    desc: "Browse available developer utilities",
    path: "/tools/developer",
  },
  {
    icon: "RG",
    title: "Student Tools",
    desc: "Open study-focused productivity tools",
    path: "/tools/student",
  },
  {
    icon: "more",
    title: "Tools Dashboard",
    desc: "Browse all tools and categories from one place",
    path: "/tools",
  },
];

export default function Home() {
  return (
    <main className="landing-root relative min-h-screen overflow-hidden text-white">
      <Navbar />

      <div className="hero-glow absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] blur-[120px] rounded-full" />

      <section className="max-w-7xl mx-auto px-6 pb-20 pt-16 text-center sm:pt-20">
        <span className="relative z-20 mb-8 mt-8 inline-flex items-center rounded-xl border-b-3 border-emerald-400/55 bg-[#0f1d18] px-9 py-4 text-xs font-semibold uppercase leading-none tracking-[0.4em] text-emerald-200 shadow-[0_6px_20px_rgba(0,0,0,0.35)]">
          Built for practical workflows
        </span>

        <h1 className="landing-hero-title mb-5 text-5xl font-bold leading-tight md:text-6xl">
          One Workspace for
          <br />
          <span className="accent-text">Everyday Utility Tasks.</span>
        </h1>

        <p className="landing-hero-copy max-w-2xl mx-auto mb-12">
          Format JSON, test APIs, and run productivity tools in seconds.
          OneTool keeps your workflow fast, clean, and focused.
        </p>

        <div className="cta-group">
          <Link
            href="/tools"
            className="btn-cta-green transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(34,197,94,0.35)] active:translate-y-0"
          >
            Start Using Tools
          </Link>
          <Link
            href="/dashboard"
            className="btn-cta-dark transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_22px_rgba(20,83,45,0.45)] active:translate-y-0"
          >
            Open Dashboard
          </Link>
        </div>
      </section>

      <section id="features" className="feature-showcase max-w-7xl mx-auto px-5 pb-28">
        <div className="feature-showcase-head">
          <h2 className="landing-section-title text-3xl font-semibold mb-3">Explore Core Features</h2>
          <p className="landing-section-copy">
            Pick a tool from a practical card grid designed for fast scanning.
          </p>
        </div>

        <div className="feature-grid">
          {popularTools.map((tool, index) => (
            <div
              key={tool.title}
              className="transition-transform duration-300 ease-out hover:z-10"
              style={{ transitionDelay: `${index * 35}ms` }}
            >
              <ToolCard {...tool} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
