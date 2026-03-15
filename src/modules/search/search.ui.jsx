"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

function normalize(value) {
  return String(value || "").toLowerCase().trim();
}

function matchesQuery(tool, query) {
  if (!query) return true;
  const haystack = [
    tool.name,
    tool.description,
    tool.category,
    ...(tool.keywords || []),
  ]
    .map(normalize)
    .join(" ");

  return haystack.includes(query);
}

export default function SearchLanding({ tools, categories, featuredTools }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const normalizedQuery = normalize(query);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      if (tool.comingSoon) return false;
      if (activeCategory !== "all" && tool.category !== activeCategory) {
        return false;
      }
      return matchesQuery(tool, normalizedQuery);
    });
  }, [tools, activeCategory, normalizedQuery]);

  const showResults = normalizedQuery.length > 0 || activeCategory !== "all";

  return (
    <main className="search-root">
      <header className="search-header">
        <Link href="/" className="search-brand">
          OneTool
          <span className="search-brand-dot">.</span>
        </Link>
        <nav className="search-actions">
          <Link href="/auth/login" className="search-link">
            Sign in
          </Link>
          <Link href="/dashboard" className="search-cta">
            Open workspace
          </Link>
        </nav>
      </header>

      <section className="search-hero">
        <div className="search-hero-copy">
          <p className="search-kicker">Search-first workspace</p>
          <h1>Find the tool you need in seconds.</h1>
          <p>
            Type a task, open the tool, and keep your work inside a focused
            dashboard.
          </p>
        </div>

        <div className="search-panel">
          <div className="search-input-wrap">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search tools like JSON formatter, API tester..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="search-input"
              autoFocus
            />
            <span className="search-kbd">Ctrl+K</span>
          </div>

          <div className="search-chips">
            <button
              type="button"
              className={`search-chip ${activeCategory === "all" ? "active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              All tools
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`search-chip ${activeCategory === category.id ? "active" : ""}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          {showResults && (
            <div className="search-results">
              {filteredTools.length === 0 ? (
                <div className="search-empty">
                  <p>No tools match that search yet.</p>
                  <span>Try a different keyword or category.</span>
                </div>
              ) : (
                filteredTools.slice(0, 8).map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.path}
                    className="search-result-card"
                  >
                    <div className="search-result-icon">{tool.icon}</div>
                    <div className="search-result-meta">
                      <div className="search-result-title">
                        <span>{tool.name}</span>
                        {tool.requiresAuth && (
                          <span className="search-tag">Workspace</span>
                        )}
                      </div>
                      <p>{tool.description}</p>
                    </div>
                    <span className="search-result-arrow">Open</span>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      <section className="search-featured">
        <div className="search-section-header">
          <h2>Featured tools</h2>
          <p>Quick access to the most used utilities.</p>
        </div>
        <div className="search-featured-grid">
          {featuredTools.map((tool) => (
            <Link key={tool.id} href={tool.path} className="search-featured-card">
              <div className="search-featured-icon">{tool.icon}</div>
              <div>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
