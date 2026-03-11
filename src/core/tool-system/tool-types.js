/**
 * Phase 0 (baseline): Core tool metadata contract.
 * Used by registry, routing, and UI surfaces.
 *
 * @typedef {Object} ToolMetadata
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} description
 * @property {string} [icon]
 * @property {boolean} [comingSoon]
 * @property {string} [version]
 * @property {string[]} [keywords]
 */

/**
 * @typedef {Object} ToolConfig
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} description
 * @property {string} [icon]
 * @property {boolean} [comingSoon]
 * @property {ToolMetadata} [metadata]
 * @property {import("react").ComponentType<any>} component
 * @property {(input: unknown, options?: Record<string, unknown>) => unknown | Promise<unknown>} [run]
 */

/**
 * Phase 0 (baseline): Execution context passed to tool runners.
 * This does not change runtime behavior; it documents the shape for future phases.
 *
 * @typedef {Object} ToolExecutionContext
 * @property {string} toolId
 * @property {string} [requestId]
 * @property {string} [userId]
 * @property {string} [source]
 * @property {Record<string, unknown>} [options]
 * @property {Record<string, unknown>} [metadata]
 */

/**
 * @typedef {Object} ToolCategoryConfig
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {string} path
 * @property {string} icon
 */

export {};
