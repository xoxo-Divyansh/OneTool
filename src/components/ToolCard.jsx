"use client";

import {
  ArrowUpRight,
  FileText,
  ImageIcon,
  LinkIcon,
  Palette,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Text,
  Wrench,
} from "lucide-react";
import Link from "next/link";

const ICON_MAP = {
  image: ImageIcon,
  background: ScanSearch,
  pdf: FileText,
  text: Text,
  password: ShieldCheck,
  color: Palette,
  url: LinkIcon,
  more: Sparkles,
  // Custom icons for our current tool IDs / categories
  AP: LinkIcon,
  JS: FileText,
  RG: ScanSearch,
  DE: Wrench,
  GN: Sparkles,
  JP: Text,
};

export default function ToolCard({ icon, title, desc, path = "#" }) {
  const Icon = ICON_MAP[icon] || Wrench;

  return (
    <Link
      href={path}
      className="tool-card-link group relative block rounded-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0c]"
    >
      <article
        className="feature-card relative overflow-hidden border border-slate-700/80 bg-gradient-to-br from-slate-900/80 to-[#12151b] p-4 transition-all duration-300 ease-out will-change-transform group-hover:-translate-y-1 group-hover:border-emerald-400/70 group-hover:shadow-[0_14px_36px_rgba(34,197,94,0.18)] group-active:translate-y-0"
        aria-label={title}
      >
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        >
          <span className="absolute -top-12 left-0 h-28 w-28 rounded-full bg-emerald-400/20 blur-2xl" />
          <span className="absolute -bottom-10 right-0 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl" />
        </span>

        <span
          className="feature-card-icon relative z-10 transition-transform duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-0.5"
          aria-hidden="true"
        >
          {Icon ? <Icon size={20} strokeWidth={2} /> : null}
        </span>

        <div className="feature-card-body relative z-10">
          <h3 className="feature-card-title transition-colors duration-300 group-hover:text-emerald-100">
            {title}
          </h3>
          <p className="feature-card-desc">{desc}</p>
        </div>

        <span className="relative z-10 mt-auto inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-300/90 transition-colors duration-300 group-hover:text-emerald-200">
          Open tool
          <ArrowUpRight
            size={14}
            strokeWidth={2.2}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </article>
    </Link>
  );
}
