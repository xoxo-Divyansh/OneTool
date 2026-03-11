/**
 * Phase 1: formal registry structure.
 * The registry is the single source of truth for tool metadata and discovery.
 */

/**
 * @typedef {import("./tool-types").ToolMetadata} ToolMetadata
 * @typedef {import("./tool-types").ToolConfig} ToolConfig
 */

function normalizeMetadata(toolConfig) {
  const metadata = toolConfig?.metadata ?? toolConfig ?? {};

  return {
    id: metadata.id,
    name: metadata.name,
    category: metadata.category,
    description: metadata.description,
    icon: metadata.icon,
    comingSoon: metadata.comingSoon,
    version: metadata.version,
    keywords: metadata.keywords,
  };
}

export function createToolRegistry() {
  /** @type {Map<string, ToolConfig>} */
  const toolMap = new Map();
  const TOOL_ID_REGEX = /^[a-z0-9-]+$/;

  function registerTool(toolConfig) {
    if (!toolConfig) return;

    const metadata = normalizeMetadata(toolConfig);
    const toolId = metadata.id ?? toolConfig.id;

    // Keep compatibility: allow registration even if metadata is minimal.
    if (!toolId) {
      throw new Error('[ToolRegistry] Tool must have an id.');
    }

    if (!TOOL_ID_REGEX.test(toolId)) {
      throw new Error(
        `[ToolRegistry] Invalid tool id "${toolId}". Use lowercase letters, numbers, and dashes only.`,
      );
    }

    if (toolMap.has(toolId)) {
      throw new Error(
        `[ToolRegistry] Duplicate tool id "${toolId}". Each tool must have a unique id.`,
      );
    }

    const mergedTool = {
      ...toolConfig,
      ...metadata,
      metadata,
    };

    toolMap.set(toolId, mergedTool);
  }

  function registerTools(toolConfigs) {
    if (!Array.isArray(toolConfigs)) return;
    toolConfigs.forEach((toolConfig) => registerTool(toolConfig));
  }

  function getTools() {
    return Array.from(toolMap.values());
  }

  function getToolById(toolId) {
    return toolMap.get(toolId) ?? null;
  }

  return {
    registerTool,
    registerTools,
    getTools,
    getToolById,
  };
}
