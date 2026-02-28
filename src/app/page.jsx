import Navbar from "@/components/common/Navbar";
import ToolCard from "@/components/ToolCard";

const popularTools = [
  { icon: "Image", title: "Image Compressor", desc: "Compress images without losing quality" },
  { icon: "BG", title: "Background Remover", desc: "Remove image background instantly" },
  { icon: "PDF", title: "PDF Tools", desc: "Convert, merge and split PDFs easily" },
  { icon: "TXT", title: "Text Formatter", desc: "Format and clean your text quickly" },
  { icon: "PASS", title: "Password Generator", desc: "Generate strong and secure passwords" },
  { icon: "CLR", title: "Color Tools", desc: "Generate and convert color palettes" },
  { icon: "URL", title: "URL Tools", desc: "Shorten and manage links easily" },
  { icon: "NEW", title: "More Tools", desc: "Many powerful tools coming soon" },
];

export default function Home() {
  return (
    <main className="landing-root min-h-screen text-white overflow-hidden">
      <Navbar />

      <div className="hero-glow absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] blur-[120px] rounded-full" />

      <section className="relative max-w-7xl mx-auto px-6 pt-28 pb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          One Workspace for
          <br />
          <span className="accent-text">Everyday Utility Tasks.</span>
        </h1>

        <p className="text-white/70 max-w-2xl mx-auto mb-12">
          Format JSON, test APIs, and run productivity tools in seconds.
          OneTool keeps your workflow fast, clean, and focused.
        </p>

        <div className="flex flex-row justify-center flex-wrap gap-x-10 gap-y-4">
          <button className="btn-cta-red">
            Start Using Tools
          </button>
          <button className="btn-cta-green">
            Open Dashboard
          </button>
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-5 pb-28">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-semibold mb-3">Most Used Tools</h2>
          <p className="text-white/60">
            Built for developers, creators, students, and growing teams
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {popularTools.map((tool) => (
            <ToolCard key={tool.title} {...tool} />
          ))}
        </div>
      </section>
    </main>
  );
}
