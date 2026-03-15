"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "onetool-theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const stored = globalThis?.localStorage?.getItem(STORAGE_KEY);
    const initial = stored === "light" ? "light" : "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("theme-light", initial === "light");
  }, []);

  useEffect(() => {
    if (!theme) return;
    document.documentElement.classList.toggle("theme-light", theme === "light");
    globalThis?.localStorage?.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
      aria-label="Toggle theme"
    >
      {theme === "light" ? "Dark mode" : "Light mode"}
    </button>
  );
}
