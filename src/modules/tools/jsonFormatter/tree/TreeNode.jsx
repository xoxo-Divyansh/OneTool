"use client";

export default function TreeNode({
  node,
  depth,
  isExpanded,
  selectedPath,
  onToggle,
  onSelect,
  onCopyPath,
}) {
  const expanded = isExpanded(node.path);
  const isSelected = selectedPath === node.path;

  return (
    <li className="json-tree-item">
      <div className={`json-tree-row ${isSelected ? "selected" : ""}`}>
        <button
          type="button"
          className="json-tree-main"
          onClick={() => {
            onSelect(node.path);
            if (node.expandable) {
              onToggle(node.path);
            }
          }}
          style={{ paddingLeft: `${depth * 14}px` }}
        >
          {node.expandable ? (
            <span className="json-tree-caret">{expanded ? "v" : ">"}</span>
          ) : (
            <span className="json-tree-caret">-</span>
          )}
          <span className="json-tree-key">{node.keyLabel}</span>
          <span className="json-tree-sep">:</span>
          <span className={`json-tree-type ${node.kind}`}>{node.preview}</span>
        </button>

        <button
          type="button"
          className="json-tree-copy"
          onClick={() => onCopyPath(node.path)}
          aria-label={`Copy ${node.path}`}
        >
          Copy Path
        </button>
      </div>

      {node.expandable && expanded ? (
        <ul className="json-tree-list">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              isExpanded={isExpanded}
              selectedPath={selectedPath}
              onToggle={onToggle}
              onSelect={onSelect}
              onCopyPath={onCopyPath}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
