import { useState, useMemo, useEffect, useCallback } from "react";
import { tools } from "@/core/tool-system/tool-registry";

/**
 * Hook for searching tools with debouncing
 * Searches across: name, description, category, keywords
 */
export function useToolSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return [];
    }

    const searchTerm = debouncedQuery.toLowerCase().trim();

    return tools
      .filter((tool) => {
        // Skip coming soon tools
        if (tool.comingSoon) return false;

        // Search in name
        if (tool.name.toLowerCase().includes(searchTerm)) return true;

        // Search in description
        if (tool.description?.toLowerCase().includes(searchTerm)) return true;

        // Search in category
        if (tool.category?.toLowerCase().includes(searchTerm)) return true;

        // Search in keywords if available
        if (tool.keywords && Array.isArray(tool.keywords)) {
          return tool.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchTerm)
          );
        }

        return false;
      })
      .slice(0, 8); // Limit to 8 results
  }, [debouncedQuery]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
  }, []);

  return {
    query,
    setQuery,
    filteredTools,
    isSearching: query !== debouncedQuery,
    hasResults: filteredTools.length > 0,
    clearSearch,
  };
}
