"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import styles from "./search.module.css";

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
    <main className={styles.searchRoot}>
      <header className={styles.searchHeader}>
        <Link href="/" className={styles.searchBrand}>
          OneTool
          <span className={styles.searchBrandDot}>.</span>
        </Link>
        <nav className={styles.searchActions}>
          <Link href="/auth/login" className={styles.searchLink}>
            Sign in
          </Link>
          <Link href="/dashboard" className={styles.searchCta}>
            Open workspace
          </Link>
        </nav>
      </header>

      <section className={styles.searchHero}>
        <div className={styles.searchHeroCopy}>
          <p className={styles.searchKicker}>Search-first workspace</p>
          <h1>Find the tool you need in seconds.</h1>
          <p>
            Type a task, open the tool, and keep your work inside a focused
            dashboard.
          </p>
        </div>

        <div className={styles.searchPanel}>
          <div className={styles.searchInputWrap}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search tools like JSON formatter, API tester..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className={styles.searchInput}
              autoFocus
            />
            <span className={styles.searchKbd}>Ctrl+K</span>
          </div>

          <div className={styles.searchChips}>
            <button
              type="button"
              className={`${styles.searchChip} ${activeCategory === "all" ? styles.searchChipActive : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              All tools
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`${styles.searchChip} ${activeCategory === category.id ? styles.searchChipActive : ""}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          {showResults && (
            <div className={styles.searchResults}>
              {filteredTools.length === 0 ? (
                <div className={styles.searchEmpty}>
                  <p>No tools match that search yet.</p>
                  <span>Try a different keyword or category.</span>
                </div>
              ) : (
                filteredTools.slice(0, 8).map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.path}
                    className={styles.searchResultCard}
                  >
                    <div className={styles.searchResultIcon}>{tool.icon}</div>
                    <div className={styles.searchResultMeta}>
                      <div className={styles.searchResultTitle}>
                        <span>{tool.name}</span>
                        {tool.requiresAuth && (
                          <span className={styles.searchTag}>Workspace</span>
                        )}
                      </div>
                      <p>{tool.description}</p>
                    </div>
                    <span className={styles.searchResultArrow}>Open</span>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      <section className={styles.searchFeatured}>
        <div className={styles.searchSectionHeader}>
          <h2>Featured tools</h2>
          <p>Quick access to the most used utilities.</p>
        </div>
        <div className={styles.searchFeaturedGrid}>
          {featuredTools.map((tool) => (
            <Link key={tool.id} href={tool.path} className={styles.searchFeaturedCard}>
              <div className={styles.searchFeaturedIcon}>{tool.icon}</div>
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
