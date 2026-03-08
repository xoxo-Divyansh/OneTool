"use client";

import { useMemo, useState } from "react";
import TreeNode from "@/modules/tools/jsonFormatter/tree/TreeNode";
import { buildJsonTreeModel } from "@/modules/tools/jsonFormatter/tree/tree.utils";

export default function JsonTree({ data, selectedPath, onSelectPath, onCopyPath }) {
  const tree = useMemo(() => buildJsonTreeModel(data), [data]);
  const [expandedPaths, setExpandedPaths] = useState(() => new Set(["$"]));

  function isExpanded(path) {
    return expandedPaths.has(path);
  }

  function togglePath(path) {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }

  function expandAll() {
    const allPaths = new Set();

    function walk(node) {
      if (node.expandable) {
        allPaths.add(node.path);
        node.children.forEach(walk);
      }
    }

    walk(tree);
    setExpandedPaths(allPaths);
  }

  function collapseAll() {
    setExpandedPaths(new Set(["$"]));
  }

  return (
    <section className="json-tree-panel">
      <header className="json-tree-header">
        <div>
          <h2>JSON Tree Viewer</h2>
          <p>Explore structure, select nodes, and copy exact paths.</p>
        </div>
        <div className="json-tree-actions">
          <button type="button" className="cmd-btn" onClick={expandAll}>
            Expand All
          </button>
          <button type="button" className="cmd-btn" onClick={collapseAll}>
            Collapse All
          </button>
        </div>
      </header>

      <p className="json-tree-selected">
        Selected: <code>{selectedPath || "$"}</code>
      </p>

      <ul className="json-tree-list">
        <TreeNode
          node={tree}
          depth={0}
          isExpanded={isExpanded}
          selectedPath={selectedPath}
          onToggle={togglePath}
          onSelect={onSelectPath}
          onCopyPath={onCopyPath}
        />
      </ul>
    </section>
  );
}
