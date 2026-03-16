"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useToolSearch } from "@/hooks/useToolSearch";
import { toolCategories } from "@/core/tool-system/tool-registry";

/**
 * Global Tool Search Component
 * Command palette style search with keyboard shortcuts
 */
export default function ToolSearch({ isOpen, onClose }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const { query, setQuery, filteredTools, isSearching, hasResults, clearSearch } = useToolSearch();

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard shortcuts (close only)
  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }

    return undefined;
  }, [isOpen, onClose]);

  // Navigate to tool
  function handleToolClick(tool) {
    router.push(tool.path);
    clearSearch();
    onClose();
  }

  // Get category label
  function getCategoryLabel(categoryId) {
    const category = toolCategories.find((cat) => cat.id === categoryId);
    return category?.label || categoryId;
  }

  if (!isOpen) return null;

  return (
    <div className="command-root fixed inset-0 z-[100] flex items-start justify-center p-4">
      {/* Backdrop */}
      <div className="command-backdrop absolute inset-0" onClick={onClose} aria-label="Close search" />

      {/* Search Modal */}
      <div className="command-modal relative w-full max-w-2xl overflow-hidden">
        {/* Search Input */}
        <div className="command-input-row flex items-center gap-3 px-5 py-4">
          <Search className="command-input-icon w-5 h-5 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="command-input-field flex-1 bg-transparent border-none outline-none text-base"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="command-clear-btn transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="command-kbd hidden sm:inline-flex items-center px-2 py-1 text-xs rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="command-results max-h-[60vh] overflow-y-auto">
          {!query.trim() && (
            <div className="command-empty px-5 py-12 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-60" />
              <p className="text-sm">Type to search tools...</p>
              <p className="text-xs mt-2">Try searching for &ldquo;json&rdquo;, &ldquo;api&rdquo;, or &ldquo;image&rdquo;</p>
            </div>
          )}

          {query.trim() && isSearching && (
            <div className="command-empty px-5 py-12 text-center">
              <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-emerald-400 rounded-full animate-spin mb-4" />
              <p className="text-sm">Searching...</p>
            </div>
          )}

          {query.trim() && !isSearching && !hasResults && (
            <div className="command-empty px-5 py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <X className="w-6 h-6 opacity-60" />
              </div>
              <p className="text-sm mb-2">No tools found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs">Try a different search term</p>
            </div>
          )}

          {hasResults && (
            <div className="py-2">
              {filteredTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  className="command-result w-full flex items-center gap-4 px-5 py-3 text-left group"
                >
                  {/* Tool Icon */}
                  <div className="command-result-icon w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center text-sm font-mono font-bold transition-all">
                    {tool.icon}
                  </div>

                  {/* Tool Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="command-result-title font-medium text-base truncate">
                        {tool.name}
                      </h3>
                      <span className="command-result-tag text-xs px-2 py-0.5 rounded-md flex-shrink-0">
                        {getCategoryLabel(tool.category)}
                      </span>
                    </div>
                    <p className="command-result-desc text-sm truncate">
                      {tool.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="command-arrow w-5 h-5 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="command-footer px-5 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="command-kbd px-1.5 py-0.5 rounded">↑</kbd>
              <kbd className="command-kbd px-1.5 py-0.5 rounded">↓</kbd>
              <span className="ml-1">Navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="command-kbd px-1.5 py-0.5 rounded">↵</kbd>
              <span className="ml-1">Select</span>
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <kbd className="command-kbd px-1.5 py-0.5 rounded">ESC</kbd>
            <span className="ml-1">Close</span>
          </span>
        </div>
      </div>
    </div>
  );
}
